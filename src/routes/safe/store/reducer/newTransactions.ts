import { handleActions } from 'redux-actions'
import { ADD_NEW_TRANSACTIONS } from '../actions/addNewTransactions'
import { Transaction } from '../models/types/transactions'

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
  transactions: null,
}

export default handleActions(
  {
    // todo: because we are thinking in remove immutableJS, I will implement this without it so it can be easier removed in future
    [ADD_NEW_TRANSACTIONS]: (state: NewTransactionsState, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
  initialState,
)
