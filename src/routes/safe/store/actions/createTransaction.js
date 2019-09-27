// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  CALL,
  type NotifiedTransaction,
  TX_TYPE_CONFIRMATION,
  TX_TYPE_EXECUTION,
  saveTxToHistory,
} from '~/logic/safe/transactions'
import {
  type Notification,
  type NotificationsQueue,
  getNofiticationsFromTxType,
  showSnackbar,
} from '~/logic/notifications'
import { getErrorMessage } from '~/test/utils/ethereumErrors'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

const createTransaction = (
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string = EMPTY_DATA,
  notifiedTransaction: NotifiedTransaction,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  shouldExecute?: boolean,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const threshold = await safeInstance.getThreshold()
  const nonce = (await safeInstance.nonce()).toString()
  const isExecution = threshold.toNumber() === 1 || shouldExecute

  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  const sigs = `0x000000000000000000000000${from.replace(
    '0x',
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`

  const notificationsQueue: NotificationsQueue = getNofiticationsFromTxType(notifiedTransaction)
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)
  let pendingExecutionKey

  let txHash
  let tx
  try {
    if (isExecution) {
      tx = await getExecutionTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from, sigs)
    } else {
      tx = await getApprovalTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from)
    }

    const sendParams = { from }
    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    await tx
      .send(sendParams)
      .once('transactionHash', (hash) => {
        txHash = hash
        closeSnackbar(beforeExecutionKey)
        const pendingExecutionNotification: Notification = isExecution ? {
          message: notificationsQueue.pendingExecution.noMoreConfirmationsNeeded.message,
          options: notificationsQueue.pendingExecution.noMoreConfirmationsNeeded.options,
        } : {
          message: notificationsQueue.pendingExecution.moreConfirmationsNeeded.message,
          options: notificationsQueue.pendingExecution.moreConfirmationsNeeded.options,
        }
        pendingExecutionKey = showSnackbar(pendingExecutionNotification, enqueueSnackbar, closeSnackbar)
      })
      .on('error', (error) => {
        console.error('Tx error: ', error)
      })
      .then(async (receipt) => {
        closeSnackbar(pendingExecutionKey)
        await saveTxToHistory(
          safeInstance,
          to,
          valueInWei,
          txData,
          CALL,
          nonce,
          receipt.transactionHash,
          from,
          isExecution ? TX_TYPE_EXECUTION : TX_TYPE_CONFIRMATION,
        )
        if (isExecution) {
          showSnackbar(notificationsQueue.afterExecution, enqueueSnackbar, closeSnackbar)
        }

        return receipt.transactionHash
      })
  } catch (err) {
    closeSnackbar(beforeExecutionKey)
    closeSnackbar(pendingExecutionKey)
    showSnackbar(notificationsQueue.afterExecutionError, enqueueSnackbar, closeSnackbar)

    const executeDataUsedSignatures = safeInstance.contract.methods
      .execTransaction(to, valueInWei, txData, CALL, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeDataUsedSignatures, from)
    console.error(`Error executing the TX: ${errMsg}`)
  }

  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default createTransaction
