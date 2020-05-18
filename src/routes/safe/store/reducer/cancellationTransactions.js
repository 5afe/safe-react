// 
import { List, Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_CANCELLATION_TRANSACTIONS } from '~/routes/safe/store/actions/addCancellationTransactions'
import { } from '~/routes/safe/store/models/transaction'

export const CANCELLATION_TRANSACTIONS_REDUCER_ID = 'cancellationTransactions'


export default handleActions(
  {
    [ADD_CANCELLATION_TRANSACTIONS]: (state, action) => action.payload,
  },
  Map(),
)
