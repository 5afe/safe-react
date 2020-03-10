// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { type NotificationsQueue, getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { generateSignaturesFromTxConfirmations } from '~/logic/safe/safeTxSigner'
import {
  type NotifiedTransaction,
  TX_TYPE_CONFIRMATION,
  TX_TYPE_EXECUTION,
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
} from '~/logic/safe/transactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from '~/routes/safe/store/actions/utils'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type GlobalState } from '~/store'
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
  approveAndExecute,
  closeSnackbar,
  enqueueSnackbar,
  notifiedTransaction,
  safeAddress,
  tx,
  userAddress,
}: ProcessTransactionArgs) => async (dispatch: ReduxDispatch<GlobalState>, getState: Function) => {
  const state: GlobalState = getState()

  const from = userAccountSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(null, lastTx, safeInstance)
  const isExecution = approveAndExecute || (await shouldExecuteTransaction(safeInstance, nonce, lastTx))

  let sigs = generateSignaturesFromTxConfirmations(tx.confirmations, approveAndExecute && userAddress)
  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  if (!sigs) {
    sigs = `0x000000000000000000000000${from.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  }

  const notificationsQueue: NotificationsQueue = getNotificationsFromTxType(notifiedTransaction, tx.origin)
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)
  let pendingExecutionKey

  let txHash
  let transaction
  const txArgs = {
    safeInstance,
    to: tx.recipient,
    valueInWei: tx.value,
    data: tx.data,
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
    transaction = isExecution ? await getExecutionTransaction(txArgs) : await getApprovalTransaction(txArgs)

    const sendParams = { from, value: 0 }

    // TODO find a better solution for this in dev and production.
    if (process.env.REACT_APP_ENV !== 'production') {
      sendParams.gasLimit = 1000000
    }

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
          await saveTxToHistory({
            ...txArgs,
            txHash,
            type: isExecution ? TX_TYPE_EXECUTION : TX_TYPE_CONFIRMATION,
          })
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
          isExecution
            ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
            : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          enqueueSnackbar,
          closeSnackbar,
        )
        dispatch(fetchTransactions(safeAddress))

        if (isExecution) {
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
