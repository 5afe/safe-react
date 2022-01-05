import { Operation, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { createTxNotifications } from 'src/logic/notifications'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
  tryOffChainSigning,
} from 'src/logic/safe/transactions'
import { estimateSafeTxGas, getGasParam, SafeTxGasEstimationProps } from 'src/logic/safe/transactions/gas'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import fetchTransactions from './transactions/fetchTransactions'
import { PayableTx } from 'src/types/contracts/types.d'
import { AppReduxState } from 'src/store'
import { Dispatch, DispatchReturn } from './types'
import { checkIfOffChainSignatureIsPossible, getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { extractShortChainName, history, SAFE_ROUTES } from 'src/routes/routes'
import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { generatePath } from 'react-router-dom'
import { fetchOnchainError } from 'src/logic/contracts/safeContractErrors'
import { isMultiSigExecutionDetails, LocalTransactionStatus } from '../models/types/gateway.d'
import { updateTransactionStatus } from './updateTransactionStatus'
import { _getChainId } from 'src/config'
import { getLastTransaction } from '../selectors/gatewayTransactions'

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

type RequiredTxProps = CreateTransactionArgs &
  Required<
    Pick<CreateTransactionArgs, 'txData' | 'operation' | 'navigateToTransactionsTab' | 'origin' | 'delayExecution'>
  >

type CreateTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>
type ConfirmEventHandler = (safeTxHash: string) => void
type ErrorEventHandler = () => void

export const METAMASK_REJECT_CONFIRM_TX_ERROR_CODE = 4001

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

const getSafeTxGas = async (txProps: RequiredTxProps, safeVersion: string): Promise<string> => {
  const estimationProps: SafeTxGasEstimationProps = {
    safeAddress: txProps.safeAddress,
    txData: txProps.txData,
    txRecipient: txProps.to,
    txAmount: txProps.valueInWei,
    operation: txProps.operation,
  }

  let safeTxGas = '0'
  try {
    safeTxGas = await estimateSafeTxGas(estimationProps, safeVersion)
  } catch (err) {
    logError(Errors._617, err.message)
  }
  return safeTxGas
}

export const createTransaction = (
  props: CreateTransactionArgs,
  confirmCallback?: ConfirmEventHandler,
  errorCallback?: ErrorEventHandler,
): CreateTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
    // Wallet connection
    const ready = await onboardUser()
    if (!ready) {
      return
    }

    // Assign fallback values to certain props
    const txProps: RequiredTxProps = {
      ...props,
      txData: props.txData ?? EMPTY_DATA,
      operation: props.operation ?? Operation.CALL,
      navigateToTransactionsTab: props.navigateToTransactionsTab ?? true,
      origin: props.origin ?? null,
      delayExecution: props.delayExecution ?? false,
    }

    // Selectors
    const state = getState()
    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state)
    const safeInstance = getGnosisSafeInstanceAt(txProps.safeAddress, safeVersion)

    // Notifications
    const notifications = createTxNotifications(txProps.notifiedTransaction, txProps.origin, dispatch)

    // Use the user-provided none or the recommented nonce
    const nonce = txProps.txNonce?.toString() ?? (await getNonce(txProps.safeAddress, safeVersion))

    // Execute right away?
    const isExecution =
      !txProps.delayExecution && (await shouldExecuteTransaction(safeInstance, nonce, getLastTransaction(state)))

    // Prepare a TxArgs object
    const txArgs = {
      safeInstance,
      to: txProps.to,
      valueInWei: txProps.valueInWei,
      data: txProps.txData,
      operation: txProps.operation,
      nonce: Number.parseInt(nonce),
      safeTxGas: txProps.safeTxGas ?? (await getSafeTxGas(txProps, safeVersion)),
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: from,
      // We're making a new tx, so there are no other signatures
      // Just pass our own address for an unsigned execution
      // Contract will compare the sender address to this
      sigs: getPreValidatedSignatures(from),
    }

    // SafeTxHash acts as the unique ID of a tx throughout the app
    const safeTxHash = generateSafeTxHash(txProps.safeAddress, safeVersion, txArgs)

    // --- Internal helpers --- //

    // On transaction completion (either confirming or executing)
    const onComplete = async (signature?: string): Promise<void> => {
      let txDetails: TransactionDetails
      try {
        txDetails = await saveTxToHistory({ ...txArgs, signature, origin })
      } catch (err) {
        // catch
        return
      }

      notifications.closePending()

      // This is used to communicate the safeTxHash to a Safe App caller
      confirmCallback?.(safeTxHash)

      // Go to a tx deep-link
      if (txProps.navigateToTransactionsTab) {
        navigateToTx(txProps.safeAddress, txDetails)
      }

      dispatch(fetchTransactions(_getChainId(), txProps.safeAddress))
    }

    const onError = async (err: Error & { code: number }) => {
      logError(Errors._803, err.message)

      errorCallback?.()

      notifications.closePending()

      if (isExecution && safeTxHash) {
        dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING_FAILED }))
      }

      const executeDataUsedSignatures = safeInstance.methods
        .execTransaction(
          txProps.to,
          txProps.valueInWei,
          txProps.txData,
          txProps.operation,
          0,
          0,
          0,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          txArgs.sigs,
        )
        .encodeABI()
      const contractErrorMessage = await fetchOnchainError(executeDataUsedSignatures, safeInstance, from)

      notifications.showOnError(err, contractErrorMessage)
    }

    const onlyConfirm = async (): Promise<string | undefined> => {
      if (!checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
        throw new Error('Cannot do an offline signature')
      }
      return await tryOffChainSigning(
        safeTxHash,
        { ...txArgs, safeAddress: txProps.safeAddress },
        hardwareWallet,
        safeVersion,
      )
    }

    const sendTx = async () => {
      // When signing on-chain don't mark as pending as it is never removed
      if (isExecution) {
        dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING }))
      }

      const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)

      const sendParams: PayableTx = {
        from,
        value: 0,
        gas: txProps.ethParameters?.ethGasLimit,
        [getGasParam()]: txProps.ethParameters?.ethGasPriceInGWei,
        nonce: txProps.ethParameters?.ethNonce,
      }

      const promiEvent = tx.send(sendParams)

      return new Promise((resolve, reject) => {
        promiEvent.once('transactionHash', resolve) // this happens much faster than receipt
        promiEvent.once('error', reject)
      })
    }

    // --- Start the tx creation --- //

    // Off-chain signature
    if (!isExecution) {
      try {
        const signature = await onlyConfirm()
        onComplete(signature)
        return
      } catch (err) {
        logError(Errors._814, err.message)
      }
    }

    // On-chain signature or execution
    try {
      await sendTx()
      onComplete()
    } catch (err) {
      onError(err)
    }
  }
}
