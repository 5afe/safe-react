import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_CANCELLATION_TRANSACTIONS } from 'routes/safe/store/actions/addCancellationTransactions'

export const CANCELLATION_TRANSACTIONS_REDUCER_ID = 'cancellationTransactions'

export default handleActions(
  {
    [ADD_CANCELLATION_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
