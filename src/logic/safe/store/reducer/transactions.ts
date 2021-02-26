import { List, Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { ADD_OR_UPDATE_TRANSACTIONS } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import { REMOVE_TRANSACTION } from 'src/logic/safe/store/actions/transactions/removeTransaction'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { AppReduxState } from 'src/store'

export const TRANSACTIONS_REDUCER_ID = 'transactions'

type TransactionBasePayload = { safeAddress: string }
type TransactionsPayload = TransactionBasePayload & { transactions: List<Transaction> }
type TransactionPayload = TransactionBasePayload & { transaction: Transaction }

type Payload = TransactionsPayload | TransactionPayload

export default handleActions<AppReduxState['transactions'], Payload>(
  {
    [ADD_OR_UPDATE_TRANSACTIONS]: (state, action: Action<TransactionsPayload>) => {
      const { safeAddress, transactions } = action.payload

      if (!safeAddress || !transactions || !transactions.size) {
        return state
      }

      return state.withMutations((map) => {
        const stateTransactionsList = map.get(safeAddress)

        if (stateTransactionsList) {
          const txsToStore = stateTransactionsList.withMutations((txsList) => {
            transactions.forEach((updateTx) => {
              const storedTxIndex = txsList.findIndex((txIterator) => txIterator.safeTxHash === updateTx.safeTxHash)

              if (storedTxIndex !== -1) {
                // Update
                if (updateTx.confirmations.size) {
                  // if there are confirmations then we replace what's stored with the new tx
                  // as we assume that this is the newest tx returned by the server
                  txsList.update(storedTxIndex, () => updateTx)
                } else {
                  // if there are no confirmations, we assume this is a mocked tx
                  // as txs without confirmation are not being returned by the server (?has_confirmations=true)
                  txsList.update(storedTxIndex, (storedTx) => storedTx.mergeDeep(updateTx))
                }
              } else {
                // Add new
                txsList.unshift(updateTx)
              }
            })
          })
          map.set(safeAddress, txsToStore)
        } else {
          map.set(safeAddress, transactions)
        }
      })
    },
    [REMOVE_TRANSACTION]: (state, action: Action<TransactionPayload>) => {
      const { safeAddress, transaction } = action.payload

      if (!safeAddress || !transaction) {
        return state
      }

      return state.withMutations((map) => {
        const stateTransactionsList = map.get(safeAddress)

        if (stateTransactionsList) {
          const storedTxIndex = stateTransactionsList.findIndex((storedTx) => storedTx.equals(transaction))

          if (storedTxIndex !== -1) {
            map.deleteIn([safeAddress, storedTxIndex])
          }
        }
      })
    },
  },
  Map(),
)
