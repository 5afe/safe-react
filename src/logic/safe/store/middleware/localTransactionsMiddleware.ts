import { Action } from 'redux-actions'

import { Dispatch } from 'src/logic/safe/store/actions/types'
import { store as reduxStore } from 'src/store'
import session from 'src/utils/storage/session'
import { updateTransactionStatus, UPDATE_TRANSACTION_STATUS } from '../actions/updateTransactionStatus'
import { TransactionStatusPayload } from '../reducer/localTransactions'
import { localStatuses } from '../selectors/txStatus'

// Share updated statuses between tabs/windows
// Test env and Safari don't support BroadcastChannel
const channel = !!window?.BroadcastChannel ? new BroadcastChannel(UPDATE_TRANSACTION_STATUS) : null

function isSameOrigin(event: MessageEvent): boolean {
  return event.origin === self.origin
}

if (channel) {
  channel.onmessage = (event: MessageEvent) => {
    if (event.data.type === UPDATE_TRANSACTION_STATUS && isSameOrigin(event)) {
      reduxStore.dispatch(updateTransactionStatus({ ...event.data.payload, isBroadcast: true }))
    }
  }
}

// Save 'local statuses' to sessionStorage
export const LOCAL_TRANSACTIONS_STATUSES_KEY = 'localTxStatuses'
export const localTransactionsMiddleware =
  ({ getState }: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<TransactionStatusPayload>): Promise<Action<TransactionStatusPayload>> => {
    const handledAction = next(action)

    switch (action.type) {
      case UPDATE_TRANSACTION_STATUS: {
        if (channel && !action.payload.isBroadcast) {
          channel.postMessage(action)
        }

        const state = getState()
        const localTxStatuses = localStatuses(state)
        session.setItem(LOCAL_TRANSACTIONS_STATUSES_KEY, localTxStatuses)
        break
      }
      default:
        break
    }

    return handledAction
  }
