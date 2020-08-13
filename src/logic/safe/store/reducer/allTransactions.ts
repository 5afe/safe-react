import { handleActions } from 'redux-actions'

import { Transaction } from '../models/types/transactions'
import { LOAD_MORE_TRANSACTIONS, LoadMoreTransactionsAction } from '../actions/allTransactions/pagination'

export const TRANSACTIONS = 'allTransactions'

export interface TransactionsState {
  [safeAddress: string]: Transaction[]
}

export default handleActions(
  {
    // todo: because we are thinking in remove immutableJS, I will implement this without it so it can be easier removed in future
    [LOAD_MORE_TRANSACTIONS]: (state: TransactionsState, action: LoadMoreTransactionsAction) => {
      const { safeAddress, transactions } = action.payload
      const oldTxs = state[safeAddress]

      return {
        ...state,
        [safeAddress]: [...oldTxs, ...transactions],
      }
    },
  },
  {},
)
