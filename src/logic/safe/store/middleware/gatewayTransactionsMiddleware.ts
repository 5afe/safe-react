import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import { ADD_HISTORY_TRANSACTIONS } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { isTransactionSummary } from 'src/logic/safe/store/models/types/gateway.d'
import { removePendingTransaction } from '../actions/pendingTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { getSafeTxHashFromId, pendingTxs } from '../selectors/pendingTransactions'
import { HistoryPayload } from '../reducer/gatewayTransactions'

export const gatewayTransactionsMiddleware =
  (store: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<HistoryPayload>): Promise<Action<HistoryPayload>> => {
    const handledAction = next(action)

    switch (action.type) {
      case ADD_HISTORY_TRANSACTIONS: {
        const state = store.getState()
        const currentChainPendingTxs = pendingTxs(state)

        // Clear any successful transactions from the pending transactions list
        for (const value of action.payload.values) {
          if (!isTransactionSummary(value)) {
            continue
          }

          const safeTxHash = getSafeTxHashFromId(value.transaction.id)
          if (currentChainPendingTxs.has(safeTxHash)) {
            store.dispatch(removePendingTransaction({ safeTxHash }))
          }
        }

        break
      }
      default:
        break
    }

    return handledAction
  }
