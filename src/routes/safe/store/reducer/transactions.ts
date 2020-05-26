import { List, Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_TRANSACTIONS } from 'src/routes/safe/store/actions/addTransactions'
import { ADD_OR_UPDATE_TRANSACTIONS } from '../actions/transactions/addOrUpdateTransactions'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

export default handleActions(
  {
    [ADD_TRANSACTIONS]: (state, action) => action.payload,
    [ADD_OR_UPDATE_TRANSACTIONS]: (state, action) => {
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
