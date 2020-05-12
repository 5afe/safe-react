// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { ADD_CANCELLATION_TRANSACTION } from '~/routes/safe/store/actions/transactions/addCancellationTransaction'
import { ADD_CANCELLATION_TRANSACTIONS } from '~/routes/safe/store/actions/transactions/addCancellationTransactions'
import { UPDATE_CANCELLATION_TRANSACTION } from '~/routes/safe/store/actions/transactions/updateCancellationTransaction'
import { type Transaction } from '~/routes/safe/store/models/transaction'

export const CANCELLATION_TRANSACTIONS_REDUCER_ID = 'cancellationTransactions'

export type CancelState = Map<string, List<Transaction>>

export default handleActions<CancelState, *>(
  {
    [ADD_CANCELLATION_TRANSACTION]: (state: CancelState, action: ActionType<Function>): CancelState => {
      const { safeAddress, transaction } = action.payload
      const transactionList = state.get(safeAddress)
      return state.set(safeAddress, transactionList.push(transaction))
    },
    [ADD_CANCELLATION_TRANSACTIONS]: (state: CancelState, action: ActionType<Function>): CancelState => action.payload,
    [UPDATE_CANCELLATION_TRANSACTION]: (state: CancelState, action: ActionType<Function>): CancelState => {
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
