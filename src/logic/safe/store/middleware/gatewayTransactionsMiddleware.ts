import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import { ADD_HISTORY_TRANSACTIONS } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { isTransactionSummary } from 'src/logic/safe/store/models/types/gateway.d'
import { removePendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { isTxPending } from 'src/logic/safe/store/selectors/pendingTransactions'
import { HistoryPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'

export const gatewayTransactionsMiddleware =
  (store: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<HistoryPayload>): Promise<Action<HistoryPayload>> => {
    const handledAction = next(action)

    switch (action.type) {
      case ADD_HISTORY_TRANSACTIONS: {
        // Clear any successful transactions from the pending list
        for (const value of action.payload.values) {
          if (!isTransactionSummary(value)) {
            continue
          }

          const { id } = value.transaction

          if (isTxPending(store.getState(), id)) {
            store.dispatch(removePendingTransaction({ id }))
          }
        }

        break
      }
      default:
        break
    }

    return handledAction
  }
