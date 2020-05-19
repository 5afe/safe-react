import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_CANCELLATION_TRANSACTIONS } from 'src/routes/safe/store/actions/addCancellationTransactions'
import {} from 'src/routes/safe/store/models/transaction'

export const CANCELLATION_TRANSACTIONS_REDUCER_ID = 'cancellationTransactions'

export default handleActions(
  {
    [ADD_CANCELLATION_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
