// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import {
  type NotifiedTransaction, approveTransaction, executeTransaction, CALL,
} from '~/logic/safe/transactions'
import { getNofiticationsFromTxType } from '~/logic/notifications'

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

  const notificationsQueue = getNofiticationsFromTxType(notifiedTransaction)

  let txHash
  try {
    if (isExecution) {
      txHash = await executeTransaction(
        notificationsQueue,
        enqueueSnackbar,
        closeSnackbar,
        safeInstance,
        to,
        valueInWei,
        txData,
        CALL,
        nonce,
        from,
      )
    } else {
      txHash = await approveTransaction(
        notificationsQueue,
        enqueueSnackbar,
        closeSnackbar,
        safeInstance,
        to,
        valueInWei,
        txData,
        CALL,
        nonce,
        from,
      )
    }
  } catch (err) {
    console.error(`Error while creating transaction: ${err}`)
  }

  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default createTransaction
