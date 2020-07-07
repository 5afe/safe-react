import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { ADD_NEW_TRANSACTIONS } from '../actions/addNewTransactions'

export const TRANSACTIONS_NEW = 'transactionsNew'

export default handleActions(
  {
    [ADD_NEW_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
