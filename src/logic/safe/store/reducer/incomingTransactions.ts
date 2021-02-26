import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_INCOMING_TRANSACTIONS } from 'src/logic/safe/store/actions/addIncomingTransactions'
import { AppReduxState } from 'src/store'

export const INCOMING_TRANSACTIONS_REDUCER_ID = 'incomingTransactions'

export default handleActions<AppReduxState['incomingTransactions']>(
  {
    [ADD_INCOMING_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
