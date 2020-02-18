// @flow
import axios from 'axios'
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { push } from 'connected-react-router'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { buildTxServiceUrl } from '~/logic/safe/transactions/txHistory'
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
import { type NotificationsQueue, getNotificationsFromTxType, showSnackbar } from '~/logic/notifications'
import { getErrorMessage } from '~/test/utils/ethereumErrors'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import type { TransactionProps } from '~/routes/safe/store/models/transaction'

const getLastTx = async (safeAddress: string): Promise<TransactionProps> => {
  try {
    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, { params: { limit: 1 } })

    return response.data.results[0]
  } catch (e) {
    console.error('failed to retrieve last Tx from server', e)
    return null
  }
}

const getSafeNonce = async (safeAddress: string): Promise<string> => {
  // use current's safe nonce as fallback
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  return (await safeInstance.nonce()).toString()
}

const getNewTxNonce = async (txNonce, lastTx, safeAddress) => {
  if (!Number.isInteger(Number.parseInt(txNonce, 10))) {
    return lastTx === null ? getSafeNonce(safeAddress) : lastTx.nonce + 1
  }
  return txNonce
}

type CreateTransactionArgs = {
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string,
  notifiedTransaction: NotifiedTransaction,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  shouldExecute?: boolean,
  txNonce?: number,
  operation?: 0 | 1,
}

const createTransaction = ({
  safeAddress,
  to,
  valueInWei,
  txData = EMPTY_DATA,
  notifiedTransaction,
  enqueueSnackbar,
  closeSnackbar,
  shouldExecute = false,
  txNonce,
  operation = CALL,
  navigateToTransactionsTab = true,
}: CreateTransactionArgs) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  if (navigateToTransactionsTab) {
    dispatch(push(`${SAFELIST_ADDRESS}/${safeAddress}/transactions`))
  }

  const from = userAccountSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const threshold = await safeInstance.getThreshold()
  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(txNonce, lastTx, safeAddress)
  const isExecution = (lastTx && lastTx.isExecuted && threshold.toNumber() === 1) || shouldExecute

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
  try {
    if (isExecution) {
      tx = await getExecutionTransaction(
        safeInstance,
        to,
        valueInWei,
        txData,
        operation,
        nonce,
        0,
        0,
        0,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        from,
        sigs,
      )
    } else {
      tx = await getApprovalTransaction(
        safeInstance,
        to,
        valueInWei,
        txData,
        operation,
        nonce,
        0,
        0,
        0,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        from,
        sigs,
      )
    }

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
          await saveTxToHistory(
            safeInstance,
            to,
            valueInWei,
            txData,
            operation,
            nonce,
            0,
            0,
            0,
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            txHash,
            from,
            isExecution ? TX_TYPE_EXECUTION : TX_TYPE_CONFIRMATION,
          )
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
