import { handleActions } from 'redux-actions'

import { Transaction } from 'src/logic/safe/store/models/types/transactions.d'
import {
  LOAD_MORE_TRANSACTIONS,
  LoadMoreTransactionsAction,
} from 'src/logic/safe/store/actions/allTransactions/pagination'

export const TRANSACTIONS = 'allTransactions'

export interface TransactionsState {
  [safeAddress: string]: {
    totalTransactionsCount: number
    transactions: Transaction[]
  }
}

export default handleActions(
  {
    // todo: because we are thinking in remove immutableJS, I will implement this without it so it can be easier removed in future
    [LOAD_MORE_TRANSACTIONS]: (state: TransactionsState, action: LoadMoreTransactionsAction) => {
      const { safeAddress, transactions, totalTransactionsAmount } = action.payload
      const oldState = state[safeAddress]

      return {
        ...state,
        [safeAddress]: {
          ...oldState,
          transactions: [...(oldState?.transactions || []), ...transactions],
          totalTransactionsCount:
            totalTransactionsAmount > 0 ? totalTransactionsAmount : state[safeAddress].totalTransactionsCount,
        },
      }
    },
  },
  {},
)
