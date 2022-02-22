import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import session from 'src/utils/storage/session'
import {
  PENDING_TRANSACTIONS_ACTIONS,
  addPendingTransaction,
  removePendingTransaction,
} from 'src/logic/safe/store/actions/pendingTransactions'
import { PENDING_TRANSACTIONS_ID, PendingTransactionPayloads } from 'src/logic/safe/store/reducer/pendingTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { allPendingTxIds } from 'src/logic/safe/store/selectors/pendingTransactions'

// Share updated statuses between tabs/windows
// Test env and Safari don't support BroadcastChannel
const channel = !!window?.BroadcastChannel ? new BroadcastChannel(PENDING_TRANSACTIONS_ID) : null

const isSameOrigin = (event: MessageEvent): boolean => {
  return event.origin === self.origin
}

if (channel) {
  channel.onmessage = (event: MessageEvent) => {
    if (!isSameOrigin(event)) {
      return
    }

    // Flag as broadcast action
    const payload = { ...event.data.payload, isBroadcast: true }

    switch (event.data.type) {
      case PENDING_TRANSACTIONS_ACTIONS.ADD: {
        reduxStore.dispatch(addPendingTransaction(payload))
        break
      }
      case PENDING_TRANSACTIONS_ACTIONS.REMOVE: {
        reduxStore.dispatch(removePendingTransaction(payload))
        break
      }
      default:
        break
    }
  }
}

export const pendingTransactionsMiddleware =
  ({ getState }: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<PendingTransactionPayloads>): Promise<Action<PendingTransactionPayloads>> => {
    const handledAction = next(action)

    switch (action.type) {
      case PENDING_TRANSACTIONS_ACTIONS.ADD:
      case PENDING_TRANSACTIONS_ACTIONS.REMOVE: {
        if (channel && !action.payload.isBroadcast) {
          channel.postMessage(action)
        }

        const state = getState()
        session.setItem(PENDING_TRANSACTIONS_ID, allPendingTxIds(state))
        break
      }
      default:
        break
    }

    return handledAction
  }
