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
import { estimateSafeTxGas, getGasParam, SafeTxGasEstimationProps } from 'src/logic/safe/transactions/gas'
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

const getNonce = async (state: AppReduxState, safeAddress: string): Promise<string> => {
  const safeVersion = currentSafeCurrentVersion(state) as string
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)

  let nextNonce: string
  try {
    nextNonce = (await getRecommendedNonce(safeAddress)).toString()
  } catch (e) {
    logError(Errors._616, e.message)
    nextNonce = await safeInstance.methods.nonce().call()
  }
  return nextNonce
}

const getSafeTxGas = async (props: CreateTransactionArgs, safeVersion: string): Promise<string> => {
  const estimationProps: SafeTxGasEstimationProps = {
    safeAddress: props.safeAddress,
    txData: props.txData!, // Overwritten with fallback at beginning of createTransaction
    txRecipient: props.to,
    txAmount: props.valueInWei,
    operation: props.operation!, // Overwritten with fallback at beginning of createTransaction
  }

  // @TODO: Don't fallback to any value if estimation fails
  let safeTxGas = '0'
  try {
    safeTxGas = await estimateSafeTxGas(estimationProps, safeVersion)
  } catch (err) {
    logError(Errors._617, err.message)
  }
  return safeTxGas
}

const createNotifications = (notifiedTransaction: string, origin: string | null, dispatch) => {
  // Notifications
  // Each tx gets a slot in the global snackbar queue
  // When multiple snackbars are shown, it will re-use the same slot for
  // notifications about different states of the tx
  const notificationSlot = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = dispatch(enqueueSnackbar(notificationSlot.beforeExecution))

  return {
    closePending: () => dispatch(closeSnackbarAction({ key: beforeExecutionKey })),

    showOnError: (err: Error & { code: number }, contractErrorMessage: string | null) => {
      const msg = !err
        ? NOTIFICATIONS.TX_PENDING_MSG
        : {
            ...notificationSlot.afterExecutionError,
            ...(contractErrorMessage && {
              message: `${notificationSlot.afterExecutionError.message} - ${contractErrorMessage}`,
            }),
          }

      dispatch(enqueueSnackbar({ key: err.code, ...msg }))
    },
  }
}

// {
//   safeAddress,
//   to,
//   valueInWei,
//   txData = EMPTY_DATA,
//   notifiedTransaction,
//   txNonce,
//   operation = Operation.CALL,
//   navigateToTransactionsTab = true,
//   origin = null,
//   safeTxGas: safeTxGasArg,
//   ethParameters,
//   delayExecution = false,
// }

export const createTransaction =
  (
    props: CreateTransactionArgs,
    onUserConfirm?: ConfirmEventHandler,
    onError?: ErrorEventHandler,
  ): CreateTransactionAction =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
    // Fallbacks
    props.txData ??= EMPTY_DATA
    props.operation ??= Operation.CALL
    props.navigateToTransactionsTab ??= true
    // @TODO: Remove
    props.delayExecution ??= false

    const txHash = ''
    const state = getState()

    // Wallet connection
    const ready = await onboardUser()
    if (!ready) return

    // Selectors
    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state) as string
    const safeInstance = getGnosisSafeInstanceAt(props.safeAddress, safeVersion)
    const chainId = currentChainId(state)

    // Use the user-provided none or the recommented nonce
    const nonce = props.txNonce?.toString() ?? (await getNonce(state, props.safeAddress))

    // Execute right away?
    const lastTx = getLastTransaction(state)
    const isExecution = !props.delayExecution && (await shouldExecuteTransaction(safeInstance, nonce, lastTx))

    // Safe tx gas
    const safeTxGas = props.safeTxGas ?? (await getSafeTxGas(props, safeVersion))

    // We're making a new tx, so there are no other signatures
    // Just pass our own address for an unsigned execution
    // Contract will compare the sender address to this
    const sigs = getPreValidatedSignatures(from)

    const notifications = createNotifications(props.notifiedTransaction, origin, dispatch)

    // Prepare a TxArgs object
    const txArgs: TxArgs & { sender: string } = {
      safeInstance,
      to: props.to,
      valueInWei: props.valueInWei,
      data: props.txData,
      operation: props.operation,
      nonce: Number.parseInt(nonce),
      safeTxGas,
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: from,
      sigs,
    }

    // SafeTxHash acts as the unique ID of a tx throughout the app
    const safeTxHash = generateSafeTxHash(props.safeAddress, safeVersion, txArgs)

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
      onUserConfirm?.(safeTxHash)

      // Go to a tx deep-link
      if (props.navigateToTransactionsTab) {
        navigateToTx(props.safeAddress, txDetails)
      } else {
        dispatch(fetchTransactions(chainId, props.safeAddress))
      }
    }

    const onlyConfirm = async (): Promise<string | undefined> => {
      if (!checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
        throw new Error('Cannot do an offline signature')
      }
      return await tryOffChainSigning(
        safeTxHash,
        { ...txArgs, safeAddress: props.safeAddress },
        hardwareWallet,
        safeVersion,
      )
    }

    // Mark the tx as pending
    if (isExecution) {
      dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING }))
    }

    // Off-chain signature
    if (!isExecution) {
      let signature: string | undefined
      try {
        signature = await onlyConfirm()
      } catch (err) {
        logError(Errors._814, err.message)
        signature = undefined
      }
      if (signature) {
        onComplete(signature)
        return
      }
    }

    // On-chain signature or execution
    try {
      const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)

      const sendParams: PayableTx = {
        from,
        value: 0,
        gas: props.ethParameters?.ethGasLimit,
        [getGasParam()]: props.ethParameters?.ethGasPriceInGWei,
        nonce: props.ethParameters?.ethNonce,
      }

      const txPromiEvent = tx.send(sendParams)

      txPromiEvent.once('transactionHash', async () => {
        onComplete()

        // store the pending transaction's nonce
        isExecution && aboutToExecuteTx.setNonce(txArgs.nonce)
      })

      await txPromiEvent
    } catch (err) {
      logError(Errors._803, err.message)

      onError?.()

      notifications.closePending()

      if (isExecution && safeTxHash) {
        dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING_FAILED }))
      }

      const executeDataUsedSignatures = safeInstance.methods
        .execTransaction(
          props.to,
          props.valueInWei,
          props.txData,
          props.operation,
          0,
          0,
          0,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          sigs,
        )
        .encodeABI()

      const contractErrorMessage = await getContractErrorMessage({
        safeInstance,
        from,
        data: executeDataUsedSignatures,
      })

      if (contractErrorMessage) {
        logError(Errors._803, contractErrorMessage)
      }

      notifications.showOnError(isTxPendingError(err) ? null : err, contractErrorMessage)
    }

    return txHash
  }
