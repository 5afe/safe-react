// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import {
  type NotifiedTransaction,
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
  TX_TYPE_EXECUTION,
  TX_TYPE_CONFIRMATION,
} from '~/logic/safe/transactions'
import { generateSignaturesFromTxConfirmations } from '~/logic/safe/safeTxSigner'
import { type NotificationsQueue, getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { getErrorMessage } from '~/test/utils/ethereumErrors'

type ProcessTransactionArgs = {
  safeAddress: string,
  tx: Transaction,
  userAddress: string,
  notifiedTransaction: NotifiedTransaction,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  approveAndExecute?: boolean,
}

const processTransaction = ({
  safeAddress,
  tx,
  userAddress,
  notifiedTransaction,
  enqueueSnackbar,
  closeSnackbar,
  approveAndExecute,
}: ProcessTransactionArgs) => async (dispatch: ReduxDispatch<GlobalState>, getState: Function) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const threshold = (await safeInstance.getThreshold()).toNumber()
  const shouldExecute = threshold === tx.confirmations.size || approveAndExecute

  let sigs = generateSignaturesFromTxConfirmations(tx.confirmations, approveAndExecute && userAddress)
  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  if (!sigs) {
    sigs = `0x000000000000000000000000${from.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  }

  const notificationsQueue: NotificationsQueue = getNotificationsFromTxType(notifiedTransaction)
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)
  let pendingExecutionKey

  let txHash
  let transaction
  try {
    if (shouldExecute) {
      transaction = await getExecutionTransaction(
        safeInstance,
        tx.recipient,
        tx.value,
        tx.data,
        tx.operation,
        tx.nonce,
        tx.safeTxGas,
        tx.baseGas,
        tx.gasPrice || '0',
        tx.gasToken,
        tx.refundReceiver,
        from,
        sigs,
      )
    } else {
      transaction = await getApprovalTransaction(
        safeInstance,
        tx.recipient,
        tx.value,
        tx.data,
        tx.operation,
        tx.nonce,
        tx.safeTxGas,
        tx.baseGas,
        tx.gasPrice || '0',
        tx.gasToken,
        tx.refundReceiver,
        from,
      )
    }

    const sendParams = { from, value: 0 }
    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    await transaction
      .send(sendParams)
      .once('transactionHash', async hash => {
        txHash = hash
        closeSnackbar(beforeExecutionKey)

        pendingExecutionKey = showSnackbar(notificationsQueue.pendingExecution, enqueueSnackbar, closeSnackbar)

        try {
          await saveTxToHistory(
            safeInstance,
            tx.recipient,
            tx.value,
            tx.data,
            tx.operation,
            tx.nonce,
            tx.safeTxGas,
            tx.baseGas,
            tx.gasPrice || '0',
            tx.gasToken,
            tx.refundReceiver,
            txHash,
            from,
            shouldExecute ? TX_TYPE_EXECUTION : TX_TYPE_CONFIRMATION,
          )
          dispatch(fetchTransactions(safeAddress))
        } catch (err) {
          console.error(err)
        }
      })
      .on('error', error => {
        console.error('Processing transaction error: ', error)
      })
      .then(receipt => {
        closeSnackbar(pendingExecutionKey)

        showSnackbar(
          shouldExecute
            ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
            : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          enqueueSnackbar,
          closeSnackbar,
        )
        dispatch(fetchTransactions(safeAddress))

        if (shouldExecute) {
          dispatch(fetchSafe(safeAddress))
        }

        return receipt.transactionHash
      })
  } catch (err) {
    console.error(err)
    closeSnackbar(beforeExecutionKey)
    closeSnackbar(pendingExecutionKey)
    showSnackbar(notificationsQueue.afterExecutionError, enqueueSnackbar, closeSnackbar)

    const executeData = safeInstance.contract.methods.approveHash(txHash).encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeData, from)
    console.error(`Error executing the TX: ${errMsg}`)
  }

  return txHash
}

export default processTransaction
