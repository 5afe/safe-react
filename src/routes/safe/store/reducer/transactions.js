// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/addTransactions'
import { UPDATE_TRANSACTION_PENDING_ACTIONS } from '~/routes/safe/store/actions/updateTransactionPendingActions'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

export type State = Map<string, List<Transaction>>

export default handleActions<State, *>(
  {
    [ADD_TRANSACTIONS]: (state: State, action: ActionType<Function>): State => action.payload,
    [UPDATE_TRANSACTION_PENDING_ACTIONS]: (state: State, action: ActionType<Function>): State => {
      const { newPendingActions, safeAddress, txNonce } = action.payload
      const oldTxsList = state.get(safeAddress)
      if (!oldTxsList) return state
      const txIndex = oldTxsList.findIndex((tx) => tx.nonce === txNonce)
      const newTxsList = oldTxsList.updateIn([txIndex, 'ownersWithPendingActions'], () => newPendingActions)
      return state.setIn([safeAddress], newTxsList)
    },
  },
  Map(),
)
