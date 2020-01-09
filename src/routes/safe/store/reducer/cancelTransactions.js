// @flow
import { List, Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { ADD_CANCEL_TRANSACTIONS } from '~/routes/safe/store/actions/addCancelTransactions'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const CANCEL_TRANSACTIONS_REDUCER_ID = 'cancelTransactions'

export type CancelState = Map<string, List<Transaction>>

export default handleActions<CancelState, *>(
  {
    [ADD_CANCEL_TRANSACTIONS]: (state: CancelState, action: ActionType<Function>): CancelState => action.payload,
  },
  Map(),
)
