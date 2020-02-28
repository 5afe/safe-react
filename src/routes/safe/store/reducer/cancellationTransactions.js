// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_CANCELLATION_TRANSACTIONS } from '~/routes/safe/store/actions/addCancellationTransactions'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const CANCELLATION_TRANSACTIONS_REDUCER_ID = 'cancellationTransactions'

export type CancelState = Map<string, List<Transaction>>

export default handleActions<CancelState, *>(
  {
    [ADD_CANCELLATION_TRANSACTIONS]: (state: CancelState, action: ActionType<Function>): CancelState => action.payload,
  },
  Map(),
)
