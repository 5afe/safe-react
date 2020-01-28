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
import {
  type NotificationsQueue,
  getNotificationsFromTxType,
  showSnackbar,
} from '~/logic/notifications'
import { getErrorMessage } from '~/test/utils/ethereumErrors'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { SAFELIST_ADDRESS } from '~/routes/routes'

const getLastPendingTxNonce = async (safeAddress: string): Promise<number> => {
  let nonce

  try {
    const url = buildTxServiceUrl(safeAddress)

    const response = await axios.get(url, { params: { limit: 1 } })
    const lastTx = response.data.results[0]

    nonce = lastTx.nonce + 1
  } catch (err) {
    // use current's safe nonce as fallback
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
    nonce = (await safeInstance.nonce()).toString()
  }

  return nonce
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
}: CreateTransactionArgs) => async (
  dispatch: ReduxDispatch<GlobalState>,
  getState: GetState<GlobalState>,
) => {
  const state: GlobalState = getState()

  dispatch(push(`${SAFELIST_ADDRESS}/${safeAddress}/transactions`))

  const from = userAccountSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const threshold = await safeInstance.getThreshold()
  const nonce = [undefined, null, ''].includes(txNonce) ? await getLastPendingTxNonce(safeAddress) : txNonce
  const isExecution = threshold.toNumber() === 1 || shouldExecute

  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  const sigs = `0x000000000000000000000000${from.replace(
    '0x',
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`

  const notificationsQueue: NotificationsQueue = getNotificationsFromTxType(
    notifiedTransaction,
  )
  const beforeExecutionKey = showSnackbar(
    notificationsQueue.beforeExecution,
    enqueueSnackbar,
    closeSnackbar,
  )
  let pendingExecutionKey

  let txHash
  let tx
  try {
    if (isExecution) {
      tx = await getExecutionTransaction(
        safeInstance, to, valueInWei, txData, CALL, nonce,
        0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, from, sigs,
      )
    } else {
      tx = await getApprovalTransaction(
        safeInstance, to, valueInWei, txData, CALL, nonce,
        0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, from, sigs,
      )
    }

    const sendParams = { from, value: 0 }
    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    await tx
      .send(sendParams)
      .once('transactionHash', async (hash) => {
        txHash = hash
        closeSnackbar(beforeExecutionKey)

        pendingExecutionKey = showSnackbar(
          notificationsQueue.pendingExecution,
          enqueueSnackbar,
          closeSnackbar,
        )

        try {
          await saveTxToHistory(
            safeInstance,
            to,
            valueInWei,
            txData,
            CALL,
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
      .on('error', (error) => {
        console.error('Tx error: ', error)
      })
      .then((receipt) => {
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
    showSnackbar(
      notificationsQueue.afterExecutionError,
      enqueueSnackbar,
      closeSnackbar,
    )

    const executeDataUsedSignatures = safeInstance.contract.methods
      .execTransaction(
        to,
        valueInWei,
        txData,
        CALL,
        0,
        0,
        0,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        sigs,
      )
      .encodeABI()
    const errMsg = await getErrorMessage(
      safeInstance.address,
      0,
      executeDataUsedSignatures,
      from,
    )
    console.error(`Error creating the TX: ${errMsg}`)
  }

  return txHash
}

export default createTransaction
