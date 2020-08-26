import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_INCOMING_TRANSACTIONS } from 'src/logic/safe/store/actions/addIncomingTransactions'

export const INCOMING_TRANSACTIONS_REDUCER_ID = 'incomingTransactions'

export default handleActions(
  {
    [ADD_INCOMING_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
