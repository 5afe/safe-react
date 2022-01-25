import { Action, handleActions } from 'redux-actions'

import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS } from 'src/logic/safe/store/actions/pendingTransactions'

type SafeTxHash = string
export type PendingTransactionsState = Set<SafeTxHash>

export type PendingTransactionPayload = {
  safeTxHash: string
  isBroadcast?: boolean
}

export const PENDING_TRANSACTIONS_ID = 'pendingTransactions'

export const pendingTransactionsReducer = handleActions<PendingTransactionsState, PendingTransactionPayload>(
  {
    [PENDING_TRANSACTIONS_ACTIONS.ADD]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      return state.add(action.payload.safeTxHash)
    },
    [PENDING_TRANSACTIONS_ACTIONS.REMOVE]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      state.delete(action.payload.safeTxHash)
      return state
    },
  },
  session.getItem(PENDING_TRANSACTIONS_ID) || new Set<SafeTxHash>(),
)
