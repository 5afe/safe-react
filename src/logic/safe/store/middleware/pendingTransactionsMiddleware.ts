import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS, setTransactionPending } from 'src/logic/safe/store/actions/pendingTransactions'
import { PENDING_TRANSACTIONS_ID, PendingTransactionPayload } from 'src/logic/safe/store/reducer/pendingTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { localStatuses } from 'src/logic/safe/store/selectors/pendingTransactions'

// Share updated statuses between tabs/windows
// Test env and Safari don't support BroadcastChannel
const channel = !!window?.BroadcastChannel ? new BroadcastChannel(PENDING_TRANSACTIONS_ACTIONS.SET) : null

const isSameOrigin = (event: MessageEvent): boolean => {
  return event.origin === self.origin
}

if (channel) {
  channel.onmessage = (event: MessageEvent) => {
    if (event.data.type === PENDING_TRANSACTIONS_ACTIONS.SET && isSameOrigin(event)) {
      reduxStore.dispatch(setTransactionPending({ ...event.data.payload, isBroadcast: true }))
    }
  }
}

export const pendingTransactionsMiddleware =
  ({ getState }: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<PendingTransactionPayload>): Promise<Action<PendingTransactionPayload>> => {
    const handledAction = next(action)

    switch (action.type) {
      case PENDING_TRANSACTIONS_ACTIONS.SET:
      case PENDING_TRANSACTIONS_ACTIONS.CLEAR: {
        if (channel && !action.payload.isBroadcast) {
          channel.postMessage(action)
        }

        const state = getState()
        session.setItem(PENDING_TRANSACTIONS_ID, localStatuses(state))
        break
      }
      default:
        break
    }

    return handledAction
  }
