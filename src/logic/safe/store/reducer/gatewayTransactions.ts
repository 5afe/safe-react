import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { Action, handleActions } from 'redux-actions'
import { LabelValue } from '@gnosis.pm/safe-react-gateway-sdk'

import {
  ADD_HISTORY_TRANSACTIONS,
  ADD_QUEUED_TRANSACTIONS,
  REMOVE_HISTORY_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import {
  HistoryGatewayResponse,
  isLabel,
  isMultisigExecutionInfo,
  isTransactionSummary,
  QueuedGatewayResponse,
  StoreStructure,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'

import { UPDATE_TRANSACTION_DETAILS } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { getLocalStartOfDate } from 'src/utils/date'
import { sameString } from 'src/utils/strings'
import { sortObject } from 'src/utils/objects'
import { ChainId } from 'src/config/chain.d'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

export type GatewayTransactionsState = Record<ChainId, Record<string, StoreStructure>>

type BasePayload = { chainId: string; safeAddress: string; isTail?: boolean }

export type HistoryPayload = BasePayload & { values: HistoryGatewayResponse['results'] }

export type RemoveHistoryPayload = Omit<BasePayload, 'isTail'>

export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }

export type TransactionDetailsPayload = {
  chainId: string
  safeAddress: string
  transactionId: string
  value: Transaction['txDetails']
}

type Payload = HistoryPayload | RemoveHistoryPayload | QueuedPayload | TransactionDetailsPayload

/**
 * Create a hash map of transactions by nonce.
 * Each nonce maps to one or more transactions (e.g. original tx and a rejection tx).
 */
const makeQueueByNonce = (items: QueuedGatewayResponse['results']): Record<string, Transaction[]> => {
  return items.reduce((result, item) => {
    if (!(isTransactionSummary(item) && isMultisigExecutionInfo(item.transaction.executionInfo))) return result

    const { nonce } = item.transaction.executionInfo
    if (!result[nonce]) result[nonce] = []
    result[nonce].push(item.transaction)

    return result
  }, {})
}

export const gatewayTransactionsReducer = handleActions<GatewayTransactionsState, Payload>(
  {
    // If a historical transaction summary is added, it will either be pushed to the end of the `history` by
    // (start of day) date/once or overwrite the currently existing one in chronologically descending order
    [ADD_HISTORY_TRANSACTIONS]: (state, action: Action<HistoryPayload>) => {
      const { chainId, safeAddress, values, isTail = false } = action.payload
      const newHistory: StoreStructure['history'] = cloneDeep(state[chainId]?.[safeAddress]?.history || {})

      values.forEach((value) => {
        if (!isTransactionSummary(value)) {
          // DATE_LABEL is discarded as it's not needed for the current implementation
          return
        }

        const transaction = value.transaction
        const startOfDate = getLocalStartOfDate(transaction.timestamp)

        if (newHistory[startOfDate] === undefined) {
          newHistory[startOfDate] = []
        }

        const txIndex = newHistory[startOfDate].findIndex(({ id }) => sameString(id, transaction.id))

        if (txIndex >= 0) {
          newHistory[startOfDate][txIndex] = transaction
        } else {
          newHistory[startOfDate].push(transaction)
          // pushing a newer transaction to the existing list messes the transactions order
          // this happens when most recent transactions are added to the existing txs in the store
          newHistory[startOfDate] = newHistory[startOfDate].sort((a, b) => b.timestamp - a.timestamp)
        }
      })

      return {
        // all the safes with their respective states
        ...state,
        // current safe
        [chainId]: {
          [safeAddress]: {
            // keep queued list
            ...state[chainId]?.[safeAddress],
            // extend history list
            history: isTail ? newHistory : sortObject(newHistory, 'desc'),
          },
        },
      }
    },

    [REMOVE_HISTORY_TRANSACTIONS]: (state, action: Action<{ chainId: string; safeAddress: string }>) => {
      const { chainId, safeAddress } = action.payload
      return {
        ...state,
        [chainId]: {
          [safeAddress]: {
            ...state[chainId]?.[safeAddress],
            history: {},
          },
        },
      }
    },

    // Queue is overwritten completely on every update
    // CGW sends a list of items where some items are LABELS (next and queued),
    // some are CONFLICT_HEADERS (ignored),
    // and some are actual TRANSACTIONS.
    // We split the queue into next and queued by the index of the "Queued" LABEL.
    // Then group TRANSACTIONS by their nonces.
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      const { chainId, safeAddress, values } = action.payload

      // From the list of TransactionItems, create two sub-lists split by where the "Queued" label is.
      // If there's no "Queued" label, put all the items into the "next" group.
      let nextItems = values
      let queuedItems = values.slice(0, 0)
      const qLabelIndex = values.findIndex((item) => isLabel(item) && item.label === LabelValue.Queued)
      if (qLabelIndex >= 0) {
        nextItems = values.slice(0, qLabelIndex)
        queuedItems = values.slice(qLabelIndex)
      }

      return {
        // all the safes with their respective states
        ...state,
        [chainId]: {
          // current safe
          [safeAddress]: {
            // keep history list
            ...state[chainId]?.[safeAddress],
            // overwrite queued lists
            queued: {
              next: makeQueueByNonce(nextItems),
              queued: makeQueueByNonce(queuedItems),
            },
          },
        },
      }
    },
    // Transaction details will be added to existing transaction summaries in the store as they are not
    // part of summaries
    [UPDATE_TRANSACTION_DETAILS]: (state, action: Action<TransactionDetailsPayload>) => {
      const { chainId, safeAddress, transactionId, value } = action.payload
      const clonedStoredTxs = cloneDeep(state[chainId]?.[safeAddress]) || {}
      const { queued: newQueued, history: newHistory } = clonedStoredTxs

      // get the tx group (it will be `queued.next`, `queued.queued` or `history`)
      txLocationLoop: for (const txLocation of ['queued.next', 'queued.queued', 'history']) {
        const txGroup: StoreStructure['queued']['next' | 'queued'] | StoreStructure['history'] = get(
          clonedStoredTxs,
          txLocation,
        )

        if (!txGroup) {
          continue
        }

        for (const [timestamp, transactions] of Object.entries(txGroup)) {
          const txIndex = transactions.findIndex(({ id }) => sameString(id, transactionId))

          if (txIndex >= 0) {
            txGroup[timestamp][txIndex]['txDetails'] = value
            break txLocationLoop
          }
        }
      }

      // update state
      return {
        // all the safes with their respective states
        ...state,
        [chainId]: {
          // current safe
          [safeAddress]: {
            history: newHistory,
            queued: newQueued,
          },
        },
      }
    },
  },
  {},
)

export default gatewayTransactionsReducer
