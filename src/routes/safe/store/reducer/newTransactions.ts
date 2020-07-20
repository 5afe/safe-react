import { handleActions } from 'redux-actions'

import { Transaction } from '../models/types/transactions'
import { LOAD_MORE_TRANSACTIONS, SET_NEXT_PAGE, SET_PREVIOUS_PAGE } from '../actions/transactionsNew/pagination'

export const TRANSACTIONS = 'transactionsNew'

export interface NewTransactionsState {
  offset: number
  limit: number
  totalTransactionsAmount: number
  transactions: {
    [safeAddress: string]: Transaction[]
  }
}

const initialState: Readonly<NewTransactionsState> = {
  offset: 0,
  limit: 50,
  totalTransactionsAmount: 0,
  transactions: {},
}

export default handleActions(
  {
    // todo: because we are thinking in remove immutableJS, I will implement this without it so it can be easier removed in future
    [LOAD_MORE_TRANSACTIONS]: (
      state: NewTransactionsState,
      action: {
        payload: {
          safeAddress: string
          transactions: Transaction[]
          totalTransactionsAmount: number
        }
      },
    ) => {
      const { safeAddress, transactions, totalTransactionsAmount } = action.payload
      const oldTxs = (state.transactions && state.transactions[safeAddress]) || []

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [safeAddress]: [...oldTxs, ...transactions],
        },
        totalTransactionsAmount,
      }
    },
    [SET_NEXT_PAGE]: (state: NewTransactionsState) => {
      return {
        ...state,
        offset: state.offset + state.limit,
      }
    },
    [SET_PREVIOUS_PAGE]: (state: NewTransactionsState) => {
      return {
        ...state,
        offset: state.offset > 0 ? state.offset - state.limit : state.offset,
      }
    },
  },
  initialState,
)
