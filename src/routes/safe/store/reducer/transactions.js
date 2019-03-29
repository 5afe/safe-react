// @flow
import { List, Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addTransactions, { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/addTransactions'
import { type Transaction } from '~/routes/safe/store/model/transaction'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

export type State = Map<string, List<Transaction>>

export default handleActions<State, *>({
  [ADD_TRANSACTIONS]: (state: State, action: ActionType<typeof addTransactions>): State =>
    action.payload,
}, Map())
