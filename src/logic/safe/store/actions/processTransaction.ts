import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType } from 'src/logic/notifications'
import {
  checkIfOffChainSignatureIsPossible,
  generateSignaturesFromTxConfirmations,
  getPreValidatedSignatures,
} from 'src/logic/safe/safeTxSigner'
import { getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { tryOffchainSigning } from 'src/logic/safe/transactions/offchainSigner'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import fetchSafe from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { mockTransaction, TxToMock } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { AppReduxState } from 'src/store'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import { storeExecutedTx, storeSignedTx, storeTx } from 'src/logic/safe/store/actions/transactions/pendingTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'

import { Dispatch, DispatchReturn } from './types'

interface ProcessTransactionArgs {
  approveAndExecute: boolean
  notifiedTransaction: string
  safeAddress: string
  tx: Transaction
  userAddress: string
  thresholdReached: boolean
}

type ProcessTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

export const processTransaction = ({
  approveAndExecute,
  notifiedTransaction,
  safeAddress,
  tx,
  userAddress,
  thresholdReached,
}: ProcessTransactionArgs): ProcessTransactionAction => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<DispatchReturn> => {
  const state = getState()

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(lastTx, safeInstance)
  const isExecution = approveAndExecute || (await shouldExecuteTransaction(safeInstance, nonce, lastTx))
  const safeVersion = await getCurrentSafeVersion(safeInstance)

  const preApprovingOwner = approveAndExecute && !thresholdReached ? userAddress : undefined
  let sigs = generateSignaturesFromTxConfirmations(tx.confirmations, preApprovingOwner)

  if (!sigs) {
    sigs = getPreValidatedSignatures(from)
  }

  const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, tx.origin)
  const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))
  let pendingExecutionKey

  let txHash
  let transaction
  const txArgs = {
    ...tx.toJS(), // merge the previous tx with new data
    safeInstance,
    to: tx.recipient,
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
    sigs,
  }

  try {
    if (checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
      const signature = await tryOffchainSigning(tx.safeTxHash, { ...txArgs, safeAddress }, hardwareWallet)

      if (signature) {
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

        await saveTxToHistory({ ...txArgs, signature })
        // TODO: while we wait for the tx to be stored in the service and later update the tx info
        //  we should update the tx status in the store to disable owners' action buttons
        dispatch(enqueueSnackbar(notificationsQueue.afterExecution.moreConfirmationsNeeded))

        dispatch(fetchTransactions(safeAddress))
        return
      }
    }

    transaction = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, tx.safeTxHash)

    const sendParams: any = { from, value: 0 }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    const txToMock: TxToMock = {
      ...txArgs,
      value: txArgs.valueInWei,
    }
    const mockedTx = await mockTransaction(txToMock, safeAddress, state)

    await transaction
      .send(sendParams)
      .once('transactionHash', async (hash: string) => {
        txHash = hash
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

        pendingExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.pendingExecution))

        try {
          await Promise.all([
            saveTxToHistory({ ...txArgs, txHash }),
            storeSignedTx({ transaction: mockedTx, from, isExecution, safeAddress, dispatch, state }),
          ])
          dispatch(fetchTransactions(safeAddress))
        } catch (e) {
          dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
          await storeTx({ transaction: tx, safeAddress, dispatch, state })
          console.error(e)
        }
      })
      .on('error', (error) => {
        dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
        storeTx({ transaction: tx, safeAddress, dispatch, state })
        console.error('Processing transaction error: ', error)
      })
      .then(async (receipt) => {
        if (pendingExecutionKey) {
          dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
        }

        dispatch(
          enqueueSnackbar(
            isExecution
              ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
              : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          ),
        )

        await storeExecutedTx({ transaction: mockedTx, from, safeAddress, isExecution, receipt, dispatch, state })

        dispatch(fetchTransactions(safeAddress))

        if (isExecution) {
          dispatch(fetchSafe(safeAddress))
        }

        return receipt.transactionHash
      })
  } catch (err) {
    const errorMsg = err.message
      ? `${notificationsQueue.afterExecutionError.message} - ${err.message}`
      : notificationsQueue.afterExecutionError.message

    dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

    if (pendingExecutionKey) {
      dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
    }

    dispatch(enqueueSnackbar({ key: err.code, message: errorMsg, options: { persist: true, variant: 'error' } }))

    if (txHash) {
      const executeData = safeInstance.methods.approveHash(txHash).encodeABI()
      const errMsg = await getErrorMessage(safeInstance.options.address, 0, executeData, from)
      console.error(`Error executing the TX: ${errMsg}`)
    }
  }

  return txHash
}
