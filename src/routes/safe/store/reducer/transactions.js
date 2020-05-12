// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_TRANSACTION } from '~/routes/safe/store/actions/transactions/addTransaction'
import { ADD_TRANSACTIONS } from '~/routes/safe/store/actions/transactions/addTransactions'
import { UPDATE_TRANSACTION } from '~/routes/safe/store/actions/transactions/updateTransaction'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

export type State = Map<string, List<Transaction>>

export default handleActions<State, *>(
  {
    [ADD_TRANSACTION]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, transaction } = action.payload
      const transactionList = state.get(safeAddress)
      return state.set(safeAddress, transactionList.push(transaction))
    },
    [ADD_TRANSACTIONS]: (state: State, action: ActionType<Function>): State => action.payload,
    [UPDATE_TRANSACTION]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, transaction } = action.payload

      const transactionList = state.get(safeAddress)

      if (!transaction) {
        return state
      }

      const storedTransactionIndex = transactionList.findIndex((tx) => tx.safeTxHash === transaction.safeTxHash)

      if (storedTransactionIndex === -1) {
        return state
      }

      return state.set(
        safeAddress,
        transactionList.update(storedTransactionIndex, (tx) => tx.merge(transaction)),
      )
    },
  },
  Map(),
)
