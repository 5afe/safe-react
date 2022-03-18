import { createAction } from 'redux-actions'
import {
  AddPendingTransactionPayload,
  RemovePendingTransactionPayload,
} from 'src/logic/safe/store/reducer/pendingTransactions'

export enum PENDING_TRANSACTIONS_ACTIONS {
  ADD = 'pendingTransactions/add',
  REMOVE = 'pendingTransactions/remove',
}

export const addPendingTransaction = createAction<AddPendingTransactionPayload>(PENDING_TRANSACTIONS_ACTIONS.ADD)
export const removePendingTransaction = createAction<RemovePendingTransactionPayload>(
  PENDING_TRANSACTIONS_ACTIONS.REMOVE,
)
