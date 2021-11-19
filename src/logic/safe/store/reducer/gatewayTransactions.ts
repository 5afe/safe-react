import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import get from 'lodash.get'
import merge from 'lodash.merge'
import { Action, handleActions } from 'redux-actions'

import {
  ADD_HISTORY_TRANSACTIONS,
  ADD_QUEUED_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { UPDATE_TRANSACTION_STATUS } from 'src/logic/safe/store/actions/updateTransactionStatus'
import {
  HistoryGatewayResponse,
  isConflictHeader,
  isLabel,
  isMultisigExecutionInfo,
  isStatusPending,
  isStatusPendingFailed,
  isTransactionSummary,
  QueuedGatewayResponse,
  StoreStructure,
  Transaction,
  TxLocation,
} from 'src/logic/safe/store/models/types/gateway.d'
import { UPDATE_TRANSACTION_DETAILS } from 'src/logic/safe/store/actions/fetchTransactionDetails'

import { AppReduxState } from 'src/store'
import { getLocalStartOfDate } from 'src/utils/date'
import { sameString } from 'src/utils/strings'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

type BasePayload = { chainId: string; safeAddress: string }
export type HistoryPayload = BasePayload & { values: HistoryGatewayResponse['results'] }
export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }
export type TransactionDetailsPayload = {
  chainId: string
  safeAddress: string
  txLocation: TxLocation
  transactionId: string
  value: Transaction['txDetails']
}
export type TransactionStatusPayload = {
  chainId: string
  safeAddress: string
  nonce: number
  id?: string
  txStatus: TransactionStatus
}

type Payload = HistoryPayload | QueuedPayload | TransactionDetailsPayload | TransactionStatusPayload

const updateTxGroup = (
  transactions: { [nonce: number]: Transaction[] },
  transaction: Transaction,
  txNonce: number,
): {
  [nonce: number]: Transaction[]
} => {
  if (!transactions?.[txNonce]) {
    return { [txNonce]: [transaction] }
  }

  const txIndex = transactions[txNonce].findIndex(({ id }) => sameString(id, transaction.id))

  if (txIndex >= 0) {
    transactions[txNonce] = [...transactions[txNonce], transaction]
    return transactions
  }

  const storedTx = transactions[txNonce][txIndex]

  const isServiceUpdate =
    isMultisigExecutionInfo(storedTx.executionInfo) &&
    isMultisigExecutionInfo(transaction.executionInfo) &&
    storedTx.executionInfo.confirmationsSubmitted !== transaction.executionInfo.confirmationsSubmitted

  if (isStatusPending(storedTx.txStatus) && !isServiceUpdate) {
    // Prioritize "PENDING" transactions as awaiting resolution
    transaction.txStatus = TransactionStatus.PENDING
  }

  transactions[txNonce][txIndex] = isServiceUpdate
    ? // Assignment removes `txDetails`, forcing a re-fetch
      transaction
    : // Merging keeps current data
      merge(storedTx, transaction)

  return transactions
}

export const gatewayTransactions = handleActions<AppReduxState['gatewayTransactions'], Payload>(
  {
    [ADD_HISTORY_TRANSACTIONS]: (state, action: Action<HistoryPayload>) => {
      const { chainId, safeAddress, values } = action.payload
      const newHistory: StoreStructure['history'] = Object.assign({}, state[chainId]?.[safeAddress]?.history)

      for (const value of values) {
        // Only transactions summaries added to history
        if (!isTransactionSummary(value)) {
          continue
        }

        const transaction = value.transaction
        const startOfDate = getLocalStartOfDate(transaction.timestamp)

        if (newHistory?.[startOfDate] === undefined) {
          newHistory[startOfDate] = [transaction]
          continue
        }

        const hasTx = newHistory[startOfDate].some(({ id }) => sameString(id, transaction.id))
        if (hasTx) {
          continue
        }

        // Sort old and new transactions
        newHistory[startOfDate] = [...newHistory[startOfDate], transaction].sort((a, b) => b.timestamp - a.timestamp)
      }

      return {
        ...state,
        [chainId]: {
          [safeAddress]: {
            ...state[chainId]?.[safeAddress],
            history: newHistory,
          },
        },
      }
    },
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      const { chainId, safeAddress, values } = action.payload
      let newNext: StoreStructure['history'] = Object.assign({}, state[chainId]?.[safeAddress]?.queued?.queued)
      let newQueued: StoreStructure['history'] = Object.assign({}, state[chainId]?.[safeAddress]?.queued?.next)

      let label: 'next' | 'queued' | undefined

      for (const value of values) {
        if (isConflictHeader(value)) {
          continue
        }

        if (isLabel(value)) {
          label = value.label.toLowerCase() as typeof label
          continue
        }

        // Only multisig transactions are added to queue lists
        if (!isTransactionSummary(value) || !isMultisigExecutionInfo(value.transaction.executionInfo)) {
          continue
        }

        const transaction = value.transaction
        const txNonce = isMultisigExecutionInfo(transaction.executionInfo)
          ? transaction.executionInfo?.nonce
          : undefined

        if (txNonce === undefined) {
          continue
        }

        if (label === undefined) {
          label = newNext[txNonce] ? 'next' : 'queued'
        }

        if (label === 'next') {
          newNext = updateTxGroup(newNext, transaction, txNonce)
          delete newQueued?.[txNonce]
        } else {
          newQueued = updateTxGroup(newQueued, transaction, txNonce)
        }
      }

      // No new transactions, empty queue list and existing next transaction
      const shouldClearNext = !values.length && !Object.keys(newQueued).length && Object.keys(newNext).length === 1

      return {
        ...state,
        [chainId]: {
          [safeAddress]: {
            ...state[chainId]?.[safeAddress],
            queued: {
              next: shouldClearNext ? {} : newNext,
              queued: newQueued,
            },
          },
        },
      }
    },
    [UPDATE_TRANSACTION_DETAILS]: (state, action: Action<TransactionDetailsPayload>) => {
      const { chainId, safeAddress, transactionId, txLocation, value } = action.payload

      if (!value) {
        return state
      }

      const storedTransactions = Object.assign({}, state[chainId][safeAddress])
      const newQueued = storedTransactions.queued
      let newHistory = storedTransactions.history

      const txGroup: StoreStructure['queued']['next' | 'queued'] | StoreStructure['history'] = get(
        storedTransactions,
        txLocation,
      )

      for (const [timestamp, transactions] of Object.entries(txGroup)) {
        const index = transactions.findIndex(({ id }) => sameString(id, transactionId))
        const hasTx = index >= 0

        if (hasTx) {
          txGroup[timestamp][index]['txDetails'] = value
          break
        }
      }

      switch (txLocation) {
        case 'history':
          newHistory = txGroup
          break
        case 'queued.next':
          newQueued['next'] = txGroup
          break
        case 'queued.queued':
          newQueued['queued'] = txGroup
          break
      }

      return {
        ...state,
        [chainId]: {
          [safeAddress]: {
            history: newHistory,
            queued: newQueued,
          },
        },
      }
    },
    [UPDATE_TRANSACTION_STATUS]: (state, action: Action<TransactionStatusPayload>) => {
      console.log('UPDATE_TRANSACTION_STATUS', action.payload)

      // If we provide the id, that transaction will be "PENDING"
      // otherwise all same-nonced transactions will be "PENDING"
      const { chainId, nonce, id, safeAddress, txStatus } = action.payload
      const storedTxs = Object.freeze(Object.assign({}, state[chainId][safeAddress]))
      const { queued: newQueued, history: newHistory } = storedTxs

      let txLocation: 'history' | 'next' | 'queued' | undefined
      let historyLocation: string | undefined

      if (storedTxs.queued.next[nonce]) {
        txLocation = 'next'
      } else if (storedTxs.queued.queued[nonce]) {
        txLocation = 'queued'
      } else {
        for (const [timestamp, transactions] of Object.entries(storedTxs.history)) {
          const txIndex = transactions.findIndex((transaction) => {
            return isMultisigExecutionInfo(transaction.executionInfo) && transaction.executionInfo.nonce === nonce
          })

          if (txIndex === -1) {
            continue
          }

          txLocation = 'history'
          historyLocation = `${timestamp}[${txIndex}]`
        }
      }

      if (!txLocation) {
        return state
      }

      if (txLocation === 'history' && historyLocation) {
        newHistory[historyLocation].txStatus = txStatus
      }

      if (['next', 'queued'].includes(txLocation)) {
        newQueued[txLocation][nonce] = storedTxs.queued[txLocation][nonce].map((txToUpdate: Transaction) => {
          // Don't set "PENDING_FAILED" if previous status wasn't "PENDING"
          if (isStatusPendingFailed(txStatus) && !isStatusPending(txToUpdate.txStatus)) {
            return txToUpdate
          }

          if (id === undefined || sameString(txToUpdate.id, id)) {
            txToUpdate.txStatus = txStatus
          }

          return txToUpdate
        })
      }

      return {
        ...state,
        [chainId]: {
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
