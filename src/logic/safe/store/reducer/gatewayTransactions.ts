import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { Action, handleActions } from 'redux-actions'
import merge from 'lodash/merge'

import {
  ADD_HISTORY_TRANSACTIONS,
  ADD_QUEUED_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import {
  HistoryGatewayResponse,
  isConflictHeader,
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

export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }

export type TransactionDetailsPayload = {
  chainId: string
  safeAddress: string
  transactionId: string
  value: Transaction['txDetails']
}

type Payload = HistoryPayload | QueuedPayload | TransactionDetailsPayload

const getSingularUpdatedQueueTx = (storedTx: Transaction, newTx: Transaction) => {
  const isUpdatedTx =
    isMultisigExecutionInfo(storedTx.executionInfo) &&
    isMultisigExecutionInfo(newTx.executionInfo) &&
    storedTx.executionInfo.confirmationsSubmitted !== newTx.executionInfo.confirmationsSubmitted

  return isUpdatedTx
    ? // Will remove txDetails as they will have changed because of new confirmations
      newTx
    : // Create new object, preserving txDetails
      merge({}, storedTx, newTx)
}

const getUpdatedQueueTxs = (txs: Transaction[], newTx: Transaction) => {
  const newTxs = txs.slice()
  const txIndex = txs.findIndex(({ id }) => sameString(id, newTx.id))

  if (txIndex >= 0) {
    const storedTx = newTxs[txIndex]
    newTxs[txIndex] = getSingularUpdatedQueueTx(storedTx, newTx)
  } else {
    newTxs.push(newTx)
    newTxs.sort((a, b) => a.timestamp - b.timestamp)
  }

  return newTxs
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
    // If a queued transaction summary is added, it will either be added to the singular `queued.next`
    // list or the pushed/update the `queued.queued` list by nonce in descending date order. If the
    // number of confirmations differs in comparison to the stored one, the tx will be overwritten
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      const { chainId, safeAddress, values } = action.payload
      let newNext = state[chainId]?.[safeAddress]?.queued?.next || {}
      // We must clone as we delete transactions that move from queue to next
      let newQueued = { ...(state[chainId]?.[safeAddress]?.queued?.queued || {}) }

      let label: 'next' | 'queued' | undefined

      values.forEach((value) => {
        if (isLabel(value)) {
          // we're assuming that the first page will always provide `next` and `queued` labels
          label = value.label.toLowerCase() as 'next' | 'queued'
          return
        }

        if (
          // Conflict headers are not needed in the current implementation
          isConflictHeader(value) ||
          !isMultisigExecutionInfo(value.transaction.executionInfo)
        ) {
          return
        }

        const txNonce = value.transaction.executionInfo?.nonce

        if (txNonce === undefined) {
          console.warn('A transaction without nonce was provided by client-gateway:', JSON.stringify(value))
          return
        }

        if (!label) {
          const oldNext = state[chainId]?.[safeAddress]?.queued?.next
          label = oldNext?.[txNonce] ? 'next' : 'queued'
        }

        const newTx = value.transaction

        if (label === 'queued') {
          if (newQueued?.[txNonce]) {
            newQueued[txNonce] = getUpdatedQueueTxs(newQueued[txNonce], newTx)
          } else {
            newQueued = { ...newQueued, [txNonce]: [newTx] }
          }
        } else {
          if (newNext?.[txNonce]) {
            newNext[txNonce] = getUpdatedQueueTxs(newNext[txNonce], newTx)
          } else {
            newNext = { [txNonce]: [newTx] }
          }
          // Remove queued transaction from queue that moved to next
          if (newQueued?.[txNonce]) {
            delete newQueued[txNonce]
          }
        }
      })

      // No new txs, empty queue list, cleanup
      if (!values.length && !Object.keys(newQueued).length && Object.keys(newNext).length === 1) {
        newNext = {}
      }

      return {
        // all the safes with their respective states
        ...state,
        [chainId]: {
          // current safe
          [safeAddress]: {
            // keep history list
            ...state[chainId]?.[safeAddress],
            // overwrites queued lists
            queued: {
              next: newNext,
              queued: newQueued,
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

          if (txIndex !== -1) {
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
