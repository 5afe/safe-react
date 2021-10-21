import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
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
import { estimateSafeTxGas } from 'src/logic/safe/transactions/gas'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'
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
import { generateSafeRoute, history, SAFE_ROUTES } from 'src/routes/routes'
import { getCurrentShortChainName, getNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

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

    if (navigateToTransactionsTab) {
      history.push(
        generateSafeRoute(SAFE_ROUTES.TRANSACTIONS_QUEUE, {
          shortName: getCurrentShortChainName(),
          safeAddress,
        }),
      )
    }

    const ready = await onboardUser()
    if (!ready) return

    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state) as string
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
    const chainId = currentChainId(state)
    const lastTx = await getLastTx(safeAddress)
    const nextNonce = await getNewTxNonce(lastTx, safeInstance)
    const nonce = txNonce !== undefined ? txNonce.toString() : nextNonce

    const isExecution = !delayExecution && (await shouldExecuteTransaction(safeInstance, nonce, lastTx))
    let safeTxGas = safeTxGasArg || '0'
    try {
      if (safeTxGasArg === undefined) {
        safeTxGas = await estimateSafeTxGas({ safeAddress, txData, txRecipient: to, txAmount: valueInWei, operation })
      }
    } catch (error) {
      safeTxGas = safeTxGasArg || '0'
    }

    const sigs = getPreValidatedSignatures(from)
    const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
    const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))

    let txHash
    const txArgs: TxArgs = {
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

    try {
      const safeTxHash = await generateSafeTxHash(safeAddress, safeVersion, txArgs)

      if (checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
        const signature = await tryOffChainSigning(safeTxHash, { ...txArgs, safeAddress }, hardwareWallet, safeVersion)

        if (signature) {
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))
          dispatch(fetchTransactions(chainId, safeAddress))

          await saveTxToHistory({ ...txArgs, signature, origin })
          onUserConfirm?.(safeTxHash)
          return
        }
      }

      const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
      const gasParam = getNetworkId() === ETHEREUM_NETWORK.MAINNET ? 'maxFeePerGas' : 'gasPrice'
      const sendParams: PayableTx = {
        from,
        value: 0,
        gas: ethParameters?.ethGasLimit,
        [gasParam]: ethParameters?.ethGasPriceInGWei,
        nonce: ethParameters?.ethNonce,
      }

      await tx
        .send(sendParams)
        .once('transactionHash', async (hash) => {
          onUserConfirm?.(safeTxHash)

          txHash = hash
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

          try {
            await saveTxToHistory({ ...txArgs, origin })
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
      onError?.()

      const notification = isTxPendingError(err)
        ? NOTIFICATIONS.TX_PENDING_MSG
        : {
            ...notificationsQueue.afterExecutionError,
            message: `${notificationsQueue.afterExecutionError.message} - ${err.message}`,
          }

      dispatch(closeSnackbarAction({ key: beforeExecutionKey }))
      dispatch(enqueueSnackbar({ key: err.code, ...notification }))

      logError(Errors._803, err.message)

      if (err.code !== METAMASK_REJECT_CONFIRM_TX_ERROR_CODE) {
        const executeDataUsedSignatures = safeInstance.methods
          .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
          .encodeABI()
        try {
          const errMsg = await getErrorMessage(safeInstance.options.address, 0, executeDataUsedSignatures, from)
          logError(Errors._803, errMsg)
        } catch (e) {
          logError(Errors._803, e.message)
        }
      }
    }

    return txHash
  }
