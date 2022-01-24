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
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { TxArgs } from '../models/types/transaction'
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
  Required<Pick<CreateTransactionArgs, 'txData' | 'operation' | 'navigateToTransactionsTab' | 'origin'>>

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

export class TxSender {
  notifications: ReturnType<typeof createTxNotifications>
  nonce: string
  isExecution: boolean
  txArgs: TxArgs
  safeTxHash: string
  txProps: RequiredTxProps
  from: string
  dispatch: Dispatch
  safeInstance: GnosisSafe
  safeVersion: string
  approveAndExecute: boolean

  // On transaction completion (either confirming or executing)
  async onComplete(signature?: string, confirmCallback?: ConfirmEventHandler): Promise<void> {
    const { txArgs, safeTxHash, txProps, dispatch, notifications, isExecution, approveAndExecute = false } = this

    let txDetails: TransactionDetails | null = null

    const isOffChainSigning = !isExecution && signature
    const isOnChainSigning = isExecution && !signature

    // If 1/? threshold and owner chooses to execute created tx immediately
    const isImmediateExecution = isOnChainSigning && !approveAndExecute

    // Propose the tx to the backend if an owner and
    // 1) It's a confirmation w/o exection
    // 2) It's a creation + execution w/o pre-approved signatures
    if (isOffChainSigning || isImmediateExecution) {
      try {
        txDetails = await saveTxToHistory({ ...txArgs, signature, origin })
      } catch (err) {
        logError(Errors._816, err.message)
        return
      }
    }

    notifications.closePending()

    // This is used to communicate the safeTxHash to a Safe App caller
    confirmCallback?.(safeTxHash)

    // Go to a tx deep-link
    if (txDetails && txProps.navigateToTransactionsTab) {
      navigateToTx(txProps.safeAddress, txDetails)
    }

    dispatch(fetchTransactions(_getChainId(), txProps.safeAddress))
  }

  async onError(err: Error & { code: number }, errorCallback?: ErrorEventHandler): Promise<void> {
    const { txArgs, isExecution, from, safeTxHash, txProps, dispatch, notifications, safeInstance } = this

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

  async onlyConfirm(hardwareWallet: boolean, smartContractWallet: boolean): Promise<string | undefined> {
    const { txArgs, isExecution, safeTxHash, txProps, safeVersion } = this

    if (!checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
      throw new Error('Cannot do an offline signature')
    }
    return await tryOffChainSigning(
      safeTxHash,
      { ...txArgs, sender: String(txArgs.sender), safeAddress: txProps.safeAddress },
      hardwareWallet,
      safeVersion,
    )
  }

  async sendTx(): Promise<string> {
    const { txArgs, isExecution, from, safeTxHash, txProps, dispatch } = this

    // When signing on-chain don't mark as pending as it is never removed
    if (isExecution) {
      dispatch(updateTransactionStatus({ safeTxHash, status: LocalTransactionStatus.PENDING }))
      aboutToExecuteTx.setNonce(txArgs.nonce)
    }

    const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(this.safeInstance, safeTxHash)

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

  async submitTx(
    state: AppReduxState,
    confirmCallback?: ConfirmEventHandler,
    errorCallback?: ErrorEventHandler,
  ): Promise<void> {
    // Off-chain signature
    if (!this.isExecution) {
      try {
        const { hardwareWallet, smartContractWallet } = providerSelector(state)
        const signature = await this.onlyConfirm(hardwareWallet, smartContractWallet)
        this.onComplete(signature, confirmCallback)
      } catch (err) {
        // User likely rejected transaction
        logError(Errors._814, err.message)
      }
      return
    }

    // On-chain signature or execution
    try {
      await this.sendTx()
      this.onComplete(undefined, confirmCallback)
    } catch (err) {
      this.onError(err, errorCallback)
    }
  }

  async prepare(dispatch: Dispatch, state: AppReduxState, txProps: RequiredTxProps): Promise<void> {
    // Wallet connection
    const ready = await onboardUser()
    if (!ready) {
      throw Error('No wallet connection')
    }

    // Selectors
    const { account } = providerSelector(state)
    this.from = account

    this.safeVersion = currentSafeCurrentVersion(state)
    this.safeInstance = getGnosisSafeInstanceAt(txProps.safeAddress, this.safeVersion)

    // Notifications
    this.notifications = createTxNotifications(txProps.notifiedTransaction, txProps.origin, dispatch)

    // Use the user-provided none or the recommented nonce
    this.nonce = txProps.txNonce?.toString() || (await getNonce(txProps.safeAddress, this.safeVersion))

    this.txProps = txProps
    this.dispatch = dispatch
  }
}

export const createTransaction = (
  props: CreateTransactionArgs,
  confirmCallback?: ConfirmEventHandler,
  errorCallback?: ErrorEventHandler,
): CreateTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
    const sender = new TxSender()

    // Selectors
    const state = getState()

    // Assign fallback values to certain props
    const txProps = {
      ...props,
      txData: props.txData ?? EMPTY_DATA,
      operation: props.operation ?? Operation.CALL,
      navigateToTransactionsTab: props.navigateToTransactionsTab ?? true,
      origin: props.origin ?? null,
    }

    // Populate instance vars
    try {
      await sender.prepare(dispatch, state, txProps)
    } catch (err) {
      logError(Errors._815, err.message)
      return
    }

    // Execute right away?
    sender.isExecution =
      !props.delayExecution &&
      (await shouldExecuteTransaction(sender.safeInstance, sender.nonce, getLastTransaction(state)))

    // Prepare a TxArgs object
    sender.txArgs = {
      safeInstance: sender.safeInstance,
      to: txProps.to,
      valueInWei: txProps.valueInWei,
      data: txProps.txData,
      operation: txProps.operation,
      nonce: Number.parseInt(sender.nonce),
      safeTxGas: txProps.safeTxGas ?? (await getSafeTxGas(txProps, sender.safeVersion)),
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: sender.from,
      // We're making a new tx, so there are no other signatures
      // Just pass our own address for an unsigned execution
      // Contract will compare the sender address to this
      sigs: getPreValidatedSignatures(sender.from),
    }

    // SafeTxHash acts as the unique ID of a tx throughout the app
    sender.safeTxHash = generateSafeTxHash(txProps.safeAddress, sender.safeVersion, sender.txArgs)

    // Start the creation
    sender.submitTx(state, confirmCallback, errorCallback)
  }
}
