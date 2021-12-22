import { Operation, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType, NOTIFICATIONS } from 'src/logic/notifications'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
  tryOffChainSigning,
} from 'src/logic/safe/transactions'
import { estimateSafeTxGas, getGasParam } from 'src/logic/safe/transactions/gas'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import fetchTransactions from './transactions/fetchTransactions'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { PayableTx } from 'src/types/contracts/types.d'
import { AppReduxState } from 'src/store'
import { Dispatch, DispatchReturn } from './types'
import { checkIfOffChainSignatureIsPossible, getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { isTxPendingError } from 'src/logic/wallets/getWeb3'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'
import { extractShortChainName, history, SAFE_ROUTES } from 'src/routes/routes'
import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { generatePath } from 'react-router-dom'
import { getContractErrorMessage } from 'src/logic/contracts/safeContractErrors'
import { getLastTransaction } from '../selectors/gatewayTransactions'
import { getRecommendedNonce } from '../../api/fetchSafeTxGasEstimation'
import { isMultiSigExecutionDetails, LocalTransactionStatus } from '../models/types/gateway.d'
import { updateTransactionStatus } from './updateTransactionStatus'

export interface CreateTransactionArgs {
  navigateToTransactionsTab?: boolean
  notifiedTransaction: string
  operation?: number
  origin?: string | null
  safeAddress: string
  to: string
  txData?: string
  txNonce?: number | string
  valueInWei: string
  safeTxGas?: string
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei'>
  delayExecution?: boolean
}

type CreateTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>
type ConfirmEventHandler = (safeTxHash: string) => void
type ErrorEventHandler = () => void

export const METAMASK_REJECT_CONFIRM_TX_ERROR_CODE = 4001

export const isKeystoneError = (err: Error): boolean => {
  return err.message.startsWith('#ktek_error')
}

const navigateToTx = (safeAddress: string, txDetails: TransactionDetails) => {
  if (!isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
    return
  }
  const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
  const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
    [TRANSACTION_ID_SLUG]: txDetails.detailedExecutionInfo.safeTxHash,
  })

  history.push(txRoute)
}

export const createTransaction =
  (
    {
      safeAddress,
      to,
      valueInWei,
      txData = EMPTY_DATA,
      notifiedTransaction,
      txNonce,
      operation = Operation.CALL,
      navigateToTransactionsTab = true,
      origin = null,
      safeTxGas: safeTxGasArg,
      ethParameters,
      delayExecution = false,
    }: CreateTransactionArgs,
    onUserConfirm?: ConfirmEventHandler,
    onError?: ErrorEventHandler,
  ): CreateTransactionAction =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
    const state = getState()

    const ready = await onboardUser()
    if (!ready) return

    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state) as string
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
    const chainId = currentChainId(state)

    const lastTx = getLastTransaction(state)
    let nextNonce: string
    try {
      nextNonce = (await getRecommendedNonce(safeAddress)).toString()
    } catch (e) {
      logError(Errors._616, e.message)
      nextNonce = await safeInstance.methods.nonce().call()
    }
    const nonce = txNonce !== undefined ? txNonce.toString() : nextNonce

    const isExecution = !delayExecution && (await shouldExecuteTransaction(safeInstance, nonce, lastTx))
    let safeTxGas = safeTxGasArg || '0'
    try {
      if (safeTxGasArg === undefined) {
        safeTxGas = await estimateSafeTxGas(
          { safeAddress, txData, txRecipient: to, txAmount: valueInWei, operation },
          safeVersion,
        )
      }
    } catch (error) {
      safeTxGas = safeTxGasArg || '0'
    }

    const sigs = getPreValidatedSignatures(from)
    const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
    const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))

    let txHash = ''
    const txArgs: TxArgs & { sender: string } = {
      safeInstance,
      to,
      valueInWei,
      data: txData,
      operation,
      nonce: Number.parseInt(nonce),
      safeTxGas,
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: from,
      sigs,
    }

    let safeTxHash = ''

    try {
      safeTxHash = await generateSafeTxHash(safeAddress, safeVersion, txArgs)

      if (isExecution) {
        dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING }))
      }

      if (checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
        const signature = await tryOffChainSigning(safeTxHash, { ...txArgs, safeAddress }, hardwareWallet, safeVersion)

        if (signature) {
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))
          const txDetails = await saveTxToHistory({ ...txArgs, signature, origin })

          dispatch(fetchTransactions(chainId, safeAddress))
          if (navigateToTransactionsTab) {
            navigateToTx(safeAddress, txDetails)
          }
          onUserConfirm?.(safeTxHash)
          return
        }
      }

      const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
      const sendParams: PayableTx = {
        from,
        value: 0,
        gas: ethParameters?.ethGasLimit,
        [getGasParam()]: ethParameters?.ethGasPriceInGWei,
        nonce: ethParameters?.ethNonce,
      }

      await tx
        .send(sendParams)
        .once('transactionHash', async (hash) => {
          onUserConfirm?.(safeTxHash)

          txHash = hash
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

          try {
            const txDetails = await saveTxToHistory({ ...txArgs, origin })

            if (navigateToTransactionsTab) {
              navigateToTx(safeAddress, txDetails)
            }
          } catch (err) {
            logError(Errors._803, err.message)

            // If we're just signing but not executing the tx, it's crucial that the request above succeeds
            if (!isExecution) {
              return
            }
          }

          // store the pending transaction's nonce
          isExecution && aboutToExecuteTx.setNonce(txArgs.nonce)

          dispatch(fetchTransactions(chainId, safeAddress))
        })
        .then(async (receipt) => {
          dispatch(fetchTransactions(chainId, safeAddress))
          return receipt.transactionHash
        })
    } catch (err) {
      logError(Errors._803, err.message)
      onError?.()

      dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

      if (isExecution && safeTxHash) {
        dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING_FAILED }))
      }

      const executeDataUsedSignatures = safeInstance.methods
        .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
        .encodeABI()

      const contractErrorMessage = await getContractErrorMessage({
        safeInstance,
        from,
        data: executeDataUsedSignatures,
      })

      if (contractErrorMessage) {
        logError(Errors._803, contractErrorMessage)
      }

      const notification = isTxPendingError(err)
        ? NOTIFICATIONS.TX_PENDING_MSG
        : {
            ...notificationsQueue.afterExecutionError,
            ...(contractErrorMessage && {
              message: `${notificationsQueue.afterExecutionError.message} - ${contractErrorMessage}`,
            }),
          }

      dispatch(enqueueSnackbar({ key: err.code, ...notification }))
    }

    return txHash
  }
