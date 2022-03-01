import { Action } from 'redux-actions'
import { backOff } from 'exponential-backoff'

import { store as reduxStore } from 'src/store'
import session from 'src/utils/storage/session'
import {
  PENDING_TRANSACTIONS_ACTIONS,
  addPendingTransaction,
  removePendingTransaction,
} from 'src/logic/safe/store/actions/pendingTransactions'
import { PENDING_TRANSACTIONS_ID, PendingTransactionPayloads } from 'src/logic/safe/store/reducer/pendingTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { allPendingTxIds, pendingTxIdsByChain } from 'src/logic/safe/store/selectors/pendingTransactions'
import { getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'
import { NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'

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
  (store: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<PendingTransactionPayloads>): Promise<Action<PendingTransactionPayloads>> => {
    const handledAction = next(action)
    const state = store.getState()

    switch (action.type) {
      case PENDING_TRANSACTIONS_ACTIONS.ADD:
      case PENDING_TRANSACTIONS_ACTIONS.REMOVE: {
        if (channel && !action.payload.isBroadcast) {
          channel.postMessage(action)
        }

        session.setItem(PENDING_TRANSACTIONS_ID, allPendingTxIds(state))
        break
      }
      case LOAD_CURRENT_SESSION: {
        const pendingTxsOnChain = pendingTxIdsByChain(state)
        const pendingTxIds = Object.keys(pendingTxsOnChain || {})

        // Don't check pending transactions if there are none
        if (pendingTxIds.length === 0) {
          break
        }

        const web3 = getWeb3ReadOnly()

        // Get current block on chain
        let sessionBlockNumber: number
        try {
          sessionBlockNumber = await web3.eth.getBlockNumber()
        } catch {
          break
        }

        // Exponentially watch each pending transaction for (un-)successful mine within 50 blocks
        for (const txId in pendingTxsOnChain) {
          const txHash = pendingTxsOnChain[txId]

          let shouldRetry = true

          try {
            await backOff(
              async () => {
                const tx = await web3.eth.getTransaction(txHash)

                if (tx || (await web3.eth.getBlockNumber()) >= sessionBlockNumber + 50) {
                  shouldRetry = false

                  store.dispatch(removePendingTransaction({ id: txId }))
                  store.dispatch(enqueueSnackbar(NOTIFICATIONS.TX_PENDING_FAILED_MSG))
                } else {
                  // backOff must throw in order to retry
                  throw new Error('Pending transaction not found')
                }
              },
              {
                startingDelay: 1000 * 10,
                timeMultiple: 3,
                numOfAttempts: 6,
                retry: () => shouldRetry,
              },
            )
          } catch {}
        }

        break
      }
      default:
        break
    }

    return handledAction
  }
