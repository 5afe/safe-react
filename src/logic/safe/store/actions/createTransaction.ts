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
import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'

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

const getSafeTxGas = async (txProps: RequiredTxProps, safeVersion: string): Promise<string> => {
  const estimationProps: SafeTxGasEstimationProps = {
    safeAddress: txProps.safeAddress,
    txData: txProps.txData,
    txRecipient: txProps.to,
    txAmount: txProps.valueInWei,
    operation: txProps.operation,
  }

  // @TODO: Don't fall back to any value if estimation fails
  let safeTxGas = '0'
  try {
    safeTxGas = await estimateSafeTxGas(estimationProps, safeVersion)
  } catch (err) {
    logError(Errors._617, err.message)
  }
  return safeTxGas
}

const createNotifications = (notifiedTransaction: string, origin: string | null, dispatch: Dispatch) => {
  // Notifications
  // Each tx gets a slot in the global snackbar queue
  // When multiple snackbars are shown, it will re-use the same slot for
  // notifications about different states of the tx
  const notificationSlot = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = dispatch(enqueueSnackbar(notificationSlot.beforeExecution))

  return {
    closePending: () => dispatch(closeSnackbarAction({ key: beforeExecutionKey })),

    showOnError: (err: Error & { code: number }, contractErrorMessage: string | null) => {
      const msg = isTxPendingError(err)
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

const fetchOnchainError = async (
  safeInstance: GnosisSafe,
  txProps: RequiredTxProps,
  sigs: string,
  from: string,
): Promise<string | null> => {
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

  return contractErrorMessage
}

export const createTransaction =
  (
    props: CreateTransactionArgs,
    confirmCallback?: ConfirmEventHandler,
    errorCallback?: ErrorEventHandler,
  ): CreateTransactionAction =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
    const txProps: RequiredTxProps = {
      ...props,
      txData: props.txData ?? EMPTY_DATA,
      operation: props.operation ?? Operation.CALL,
      navigateToTransactionsTab: props.navigateToTransactionsTab ?? true,
      origin: props.origin ?? null,
      // @TODO: Remove
      delayExecution: props.delayExecution ?? false,
    }

    let txHash = ''
    const state = getState()

    // Wallet connection
    const ready = await onboardUser()
    if (!ready) return

    // Selectors
    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state) as string
    const safeInstance = getGnosisSafeInstanceAt(txProps.safeAddress, safeVersion)
    const chainId = currentChainId(state)

    // Use the user-provided none or the recommented nonce
    const nonce = txProps.txNonce?.toString() ?? (await getNonce(state, txProps.safeAddress))

    // Execute right away?
    const lastTx = getLastTransaction(state)
    const isExecution = !txProps.delayExecution && (await shouldExecuteTransaction(safeInstance, nonce, lastTx))

    // Safe tx gas
    const safeTxGas = txProps.safeTxGas ?? (await getSafeTxGas(txProps, safeVersion))

    // We're making a new tx, so there are no other signatures
    // Just pass our own address for an unsigned execution
    // Contract will compare the sender address to this
    const sigs = getPreValidatedSignatures(from)

    const notifications = createNotifications(txProps.notifiedTransaction, origin, dispatch)

    // Prepare a TxArgs object
    const txArgs: TxArgs & { sender: string } = {
      safeInstance,
      to: txProps.to,
      valueInWei: txProps.valueInWei,
      data: txProps.txData,
      operation: txProps.operation,
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
    const safeTxHash = generateSafeTxHash(txProps.safeAddress, safeVersion, txArgs)

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
      } else {
        dispatch(fetchTransactions(chainId, txProps.safeAddress))
      }
    }

    const onError = async (err: Error & { code: number }) => {
      logError(Errors._803, err.message)

      errorCallback?.()

      notifications.closePending()

      if (isExecution && safeTxHash) {
        dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING_FAILED }))
      }

      const contractErrorMessage = await fetchOnchainError(safeInstance, txProps, sigs, from)

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

      const receipt = await tx.send(sendParams)

      return receipt.transactionHash
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
      txHash = await sendTx()
    } catch (err) {
      onError(err)
    }

    if (txHash) {
      onComplete()
    }

    return txHash
  }
