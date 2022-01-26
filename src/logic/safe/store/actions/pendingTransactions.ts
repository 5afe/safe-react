import { createAction } from 'redux-actions'
import { PendingTransactionPayload } from 'src/logic/safe/store/reducer/pendingTransactions'

export enum PENDING_TRANSACTIONS_ACTIONS {
  ADD = 'pendingTransactions/add',
  REMOVE = 'pendingTransactions/remove',
}

export const addPendingTransaction = createAction<PendingTransactionPayload>(PENDING_TRANSACTIONS_ACTIONS.ADD)
export const removePendingTransaction = createAction<PendingTransactionPayload>(PENDING_TRANSACTIONS_ACTIONS.REMOVE)
