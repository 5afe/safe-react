import { handleActions } from 'redux-actions'
import { ADD_NEW_TRANSACTIONS } from '../actions/transactionsNew/addNewTransactions'
import { Transaction } from '../models/types/transactions'
import { SET_NEXT_PAGE } from '../actions/transactionsNew/setNextPage'
import { SET_PREVIOUS_PAGE } from '../actions/transactionsNew/setPreviousPage'

export const TRANSACTIONS = 'transactionsNew'

export interface NewTransactionsState {
  offset: number
  limit: number
  transactions: {
    [safeAddress: string]: Transaction[]
  }
}

const initialState: Readonly<NewTransactionsState> = {
  offset: 0,
  limit: 20,
  transactions: {},
}

export default handleActions(
  {
    // todo: because we are thinking in remove immutableJS, I will implement this without it so it can be easier removed in future
    [ADD_NEW_TRANSACTIONS]: (
      state: NewTransactionsState,
      action: { payload: { safeAddress: string; transactions: { [safeAddress: string]: Transaction[] } } },
    ) => {
      const { safeAddress, transactions } = action.payload
      const oldTxs = (state.transactions && state.transactions[safeAddress]) || []

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [safeAddress]: [...oldTxs, ...transactions[safeAddress]],
        },
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
