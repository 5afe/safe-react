// @flow
import { push } from 'connected-react-router'
import type { GetState, Dispatch as ReduxDispatch } from 'redux'

import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { type NotificationsQueue, getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import {
  CALL,
  type NotifiedTransaction,
  TX_TYPE_CONFIRMATION,
  TX_TYPE_EXECUTION,
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
} from '~/logic/safe/transactions'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from '~/routes/safe/store/actions/utils'
import { type GlobalState } from '~/store'
import { getErrorMessage } from '~/test/utils/ethereumErrors'

type CreateTransactionArgs = {
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string,
  notifiedTransaction: NotifiedTransaction,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  txNonce?: number,
  operation?: 0 | 1,
  navigateToTransactionsTab?: boolean,
  origin?: string | null,
}

const createTransaction = ({
  safeAddress,
  to,
  valueInWei,
  txData = EMPTY_DATA,
  notifiedTransaction,
  enqueueSnackbar,
  closeSnackbar,
  txNonce,
  operation = CALL,
  navigateToTransactionsTab = true,
  origin = null,
}: CreateTransactionArgs) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  if (navigateToTransactionsTab) {
    dispatch(push(`${SAFELIST_ADDRESS}/${safeAddress}/transactions`))
  }

  const from = userAccountSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance)
  const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  const sigs = `0x000000000000000000000000${from.replace(
    '0x',
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`

  const notificationsQueue: NotificationsQueue = getNotificationsFromTxType(notifiedTransaction)
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)
  let pendingExecutionKey

  let txHash
  let tx
  const txArgs = {
    safeInstance,
    to,
    valueInWei,
    data: txData,
    operation,
    nonce,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS,
    sender: from,
    sigs,
  }

  try {
    tx = isExecution ? await getExecutionTransaction(txArgs) : await getApprovalTransaction(txArgs)

    const sendParams = { from, value: 0 }

    // TODO find a better solution for this in dev and production.
    if (process.env.REACT_APP_ENV !== 'production') {
      sendParams.gasLimit = 1000000
    }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    await tx
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
            origin,
          })
          dispatch(fetchTransactions(safeAddress))
        } catch (err) {
          console.error(err)
        }
      })
      .on('error', error => {
        console.error('Tx error: ', error)
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

        return receipt.transactionHash
      })
  } catch (err) {
    console.error(err)
    closeSnackbar(beforeExecutionKey)
    closeSnackbar(pendingExecutionKey)
    showSnackbar(notificationsQueue.afterExecutionError, enqueueSnackbar, closeSnackbar)

    const executeDataUsedSignatures = safeInstance.contract.methods
      .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeDataUsedSignatures, from)
    console.error(`Error creating the TX: ${errMsg}`)
  }

  return txHash
}

export default createTransaction
