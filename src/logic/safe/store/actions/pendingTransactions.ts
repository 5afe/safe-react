import { createAction } from 'redux-actions'
import { PendingTransactionPayload } from 'src/logic/safe/store/reducer/pendingTransactions'

export enum PENDING_TRANSACTIONS_ACTIONS {
  SET = 'pendingTransactions/set',
  CLEAR = 'pendingTransactions/remove',
}

export const setTransactionPending = createAction<PendingTransactionPayload>(PENDING_TRANSACTIONS_ACTIONS.SET)
export const clearTransactionPending = createAction<PendingTransactionPayload>(PENDING_TRANSACTIONS_ACTIONS.CLEAR)
