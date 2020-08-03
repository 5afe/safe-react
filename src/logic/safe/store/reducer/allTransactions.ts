import { handleActions } from 'redux-actions'

import { Transaction } from '../models/types/transactions'
import { LOAD_MORE_TRANSACTIONS } from '../actions/transactionsNew/pagination'

export const TRANSACTIONS = 'allTransactions'

export interface TransactionsState {
  transactions: {
    [safeAddress: string]: Transaction[]
  }
}

const initialState: Readonly<TransactionsState> = {
  transactions: {},
}

export default handleActions(
  {
    // todo: because we are thinking in remove immutableJS, I will implement this without it so it can be easier removed in future
    [LOAD_MORE_TRANSACTIONS]: (
      state: TransactionsState,
      action: {
        payload: {
          safeAddress: string
          transactions: Transaction[]
        }
      },
    ) => {
      const { safeAddress, transactions } = action.payload
      const oldTxs = (state.transactions && state.transactions[safeAddress]) || []

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [safeAddress]: [...oldTxs, ...transactions],
        },
      }
    },
  },
  initialState,
)
