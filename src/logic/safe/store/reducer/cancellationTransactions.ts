import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { ADD_OR_UPDATE_CANCELLATION_TRANSACTIONS } from 'src/logic/safe/store/actions/transactions/addOrUpdateCancellationTransactions'
import { REMOVE_CANCELLATION_TRANSACTION } from 'src/logic/safe/store/actions/transactions/removeCancellationTransaction'

export const CANCELLATION_TRANSACTIONS_REDUCER_ID = 'cancellationTransactions'

export type CancellationTransactions = Map<string, Transaction>
export type CancellationTxState = Map<string, CancellationTransactions>

export default handleActions(
  {
    [ADD_OR_UPDATE_CANCELLATION_TRANSACTIONS]: (state, action) => {
      const { safeAddress, transactions } = action.payload

      if (!safeAddress || !transactions || !transactions.size) {
        return state
      }

      return state.withMutations((map) => {
        const stateTransactionsMap = map.get(safeAddress)

        if (stateTransactionsMap) {
          transactions.forEach((updateTx) => {
            const keyPath = [safeAddress, `${updateTx.nonce}`]

            if (updateTx.confirmations.size) {
              // if there are confirmations then we replace what's stored with the new tx
              // as we assume that this is the newest tx returned by the server
              map.setIn(keyPath, updateTx)
            } else {
              // if there are no confirmations, we assume this is a mocked tx
              // as txs without confirmation are not being returned by the server (?has_confirmations=true)
              map.mergeDeepIn(keyPath, updateTx)
            }
          })
        } else {
          map.set(safeAddress, transactions)
        }
      })
    },
    [REMOVE_CANCELLATION_TRANSACTION]: (state, action) => {
      const { safeAddress, transaction } = action.payload

      if (!safeAddress || !transaction) {
        return state
      }

      return state.withMutations((map) => {
        const stateTransactionsMap = map.get(safeAddress)

        if (stateTransactionsMap) {
          map.deleteIn([safeAddress, `${transaction.nonce}`])
        }
      })
    },
  },
  Map(),
)
