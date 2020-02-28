// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_INCOMING_TRANSACTIONS } from '~/routes/safe/store/actions/addIncomingTransactions'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'

export const INCOMING_TRANSACTIONS_REDUCER_ID = 'incomingTransactions'

export type IncomingState = Map<string, List<IncomingTransaction>>

export default handleActions<IncomingState, *>(
  {
    [ADD_INCOMING_TRANSACTIONS]: (state: IncomingState, action: ActionType<Function>): IncomingState => action.payload,
  },
  Map(),
)
