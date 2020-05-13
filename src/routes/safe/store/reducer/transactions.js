// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/addTransactions'
import { ADD_OR_UPDATE_TRANSACTIONS } from '~/routes/safe/store/actions/transactions/addOrUpdateTransactions'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

export type State = Map<string, List<Transaction>>

export default handleActions<State, *>(
  {
    [ADD_TRANSACTIONS]: (state: State, action: ActionType<Function>): State => action.payload,
    [ADD_OR_UPDATE_TRANSACTIONS]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, transactions } = action.payload

      if (!safeAddress || !transactions) {
        return state
      }

      const newState = state.withMutations((map) => {
        const stateTransactionsList = map.get(safeAddress)
        if (stateTransactionsList) {
          let newTxList
          transactions.forEach((updateTx) => {
            const txIndex = stateTransactionsList.findIndex((txIterator) => txIterator.nonce === updateTx.nonce)
            if (txIndex !== -1) {
              // Update
              newTxList = stateTransactionsList.update(txIndex, (oldTx) => oldTx.merge(updateTx))
              map.set(safeAddress, newTxList)
            } else {
              // Add new
              map.update(safeAddress, (oldTxList) => oldTxList.merge(List([updateTx])))
            }
          })
        } else {
          map.set(safeAddress, transactions)
        }
      })

      return newState
    },
  },
  Map(),
)
