import { List } from 'immutable'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { createTxNotifications } from 'src/logic/notifications'
import {
  checkIfOffChainSignatureIsPossible,
  generateSignaturesFromTxConfirmations,
  getPreValidatedSignatures,
} from 'src/logic/safe/safeTxSigner'
import { getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { tryOffChainSigning } from 'src/logic/safe/transactions/offchainSigner'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { getNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { AppReduxState } from 'src/store'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Dispatch, DispatchReturn } from './types'
import { PayableTx } from 'src/types/contracts/types'
import { updateTransactionStatus } from 'src/logic/safe/store/actions/updateTransactionStatus'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { fetchOnchainError } from 'src/logic/contracts/safeContractErrors'
import { onboardUser } from 'src/components/ConnectButton'
import { getGasParam } from '../../transactions/gas'
import { getLastTransaction } from '../selectors/gatewayTransactions'
import { LocalTransactionStatus } from '../models/types/gateway.d'
import { _getChainId } from 'src/config'

interface ProcessTransactionArgs {
  approveAndExecute: boolean
  notifiedTransaction: string
  safeAddress: string
  tx: {
    id: string
    confirmations: List<Confirmation>
    origin: string // json.stringified url, name
    to: string
    value: string
    data: string
    operation: Operation
    nonce: number
    safeTxGas: string
    safeTxHash: string
    baseGas: string
    gasPrice: string
    gasToken: string
    refundReceiver: string
  }
  userAddress: string
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei'>
  thresholdReached: boolean
}

type ProcessTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

export const processTransaction = ({
  approveAndExecute,
  notifiedTransaction,
  safeAddress,
  tx,
  userAddress,
  ethParameters,
  thresholdReached,
}: ProcessTransactionArgs): ProcessTransactionAction => {
  return async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
    // Wallet connection
    const ready = await onboardUser()
    if (!ready) {
      return
    }

    // Selectors
    const state = getState()
    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const safeVersion = currentSafeCurrentVersion(state)
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)

    // Notifications
    const notifications = createTxNotifications(notifiedTransaction, tx.origin, dispatch)

    // Transaction hash to retrieve error
    let txHash: string

    // Get the recommended nonce
    const nonce = await getNonce(safeAddress, safeVersion)

    // Execute right away?
    const isExecution =
      approveAndExecute || (await shouldExecuteTransaction(safeInstance, nonce, getLastTransaction(state)))

    const preApprovingOwner = approveAndExecute && !thresholdReached ? userAddress : undefined

    const txArgs = {
      ...tx, // Merge previous tx with new data
      safeInstance,
      to: tx.to,
      valueInWei: tx.value,
      data: tx.data ?? EMPTY_DATA,
      operation: tx.operation,
      nonce: tx.nonce,
      safeTxGas: tx.safeTxGas,
      baseGas: tx.baseGas,
      gasPrice: tx.gasPrice || '0',
      gasToken: tx.gasToken,
      refundReceiver: tx.refundReceiver,
      sender: from,
      sigs:
        generateSignaturesFromTxConfirmations(tx.confirmations, preApprovingOwner) || getPreValidatedSignatures(from),
    }

    // --- Internal helpers --- //

    const onComplete = async (signature?: string): Promise<void> => {
      try {
        await saveTxToHistory({ ...txArgs, signature, origin })
      } catch (err) {
        // catch
        return
      }

      notifications.closePending()

      dispatch(fetchTransactions(_getChainId(), safeAddress))
    }

    const onError = async (err: Error & { code: number }) => {
      logError(Errors._803, err.message)

      notifications.closePending()

      if (isExecution && tx.safeTxHash) {
        dispatch(updateTransactionStatus({ safeTxHash: tx.safeTxHash, status: LocalTransactionStatus.PENDING_FAILED }))
      }

      const executeData = safeInstance.methods.approveHash(txHash || '').encodeABI()
      const contractErrorMessage = await fetchOnchainError(executeData, safeInstance, from)

      notifications.showOnError(err, contractErrorMessage)
    }

    const onlyConfirm = async (): Promise<string | undefined> => {
      if (!checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
        throw new Error('Cannot do an offline signature')
      }
      return await tryOffChainSigning(tx.safeTxHash, { ...txArgs, safeAddress }, hardwareWallet, safeVersion)
    }

    const sendTx = async (): Promise<string> => {
      // When signing on-chain don't mark as pending as it is never removed
      if (isExecution) {
        dispatch(updateTransactionStatus({ safeTxHash: tx.safeTxHash, status: LocalTransactionStatus.PENDING }))
      }

      const transaction = isExecution
        ? getExecutionTransaction(txArgs)
        : getApprovalTransaction(safeInstance, tx.safeTxHash)

      const sendParams: PayableTx = {
        from,
        value: 0,
        gas: ethParameters?.ethGasLimit,
        [getGasParam()]: ethParameters?.ethGasPriceInGWei,
        nonce: ethParameters?.ethNonce,
      }

      const promiEvent = transaction.send(sendParams)

      return new Promise((resolve, reject) => {
        promiEvent.once('transactionHash', resolve) // this happens much faster than receipt
        promiEvent.once('error', reject)
      })
    }

    // --- Begin tx processing --- //

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
      txHash = await sendTx()
      onComplete()
    } catch (err) {
      onError(err)
    }
  }
}
