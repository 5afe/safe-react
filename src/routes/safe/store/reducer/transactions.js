import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_TRANSACTIONS } from 'src/routes/safe/store/actions/addTransactions'
import {} from 'src/routes/safe/store/models/transaction'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

export default handleActions(
  {
    [ADD_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
