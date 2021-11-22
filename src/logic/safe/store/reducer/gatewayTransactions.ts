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

const updateQueuedTxGroup = <T extends StoreStructure['queued']['next' | 'queued']>(
  txGroup: T,
  newTx: Transaction,
  txNonce: number,
): T => {
  const txIndex = txGroup[txNonce].findIndex(({ id }) => sameString(id, newTx.id))
  const hasTx = txIndex >= 0

  if (!hasTx) {
    txGroup[txNonce] = [...txGroup[txNonce], newTx]
    return txGroup
  }

  const storedTx = txGroup[txNonce][txIndex]

  const isServiceUpdate =
    isMultisigExecutionInfo(storedTx.executionInfo) &&
    isMultisigExecutionInfo(newTx.executionInfo) &&
    storedTx.executionInfo.confirmationsSubmitted !== newTx.executionInfo?.confirmationsSubmitted

  if (isStatusPending(storedTx.txStatus) && !isServiceUpdate) {
    // Prioritize "PENDING" transactions as awaiting resolution
    newTx.txStatus = TransactionStatus.PENDING
  }

  txGroup[txNonce][txIndex] = isServiceUpdate
    ? // Assignment removes `txDetails`, forcing a re-fetch
      newTx
    : // Merging keeps current data
      merge(storedTx, newTx)

  return txGroup
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

        const newTx = value.transaction
        const startOfDate = getLocalStartOfDate(newTx.timestamp)

        if (newHistory?.[startOfDate] === undefined) {
          newHistory[startOfDate] = [newTx]
          continue
        }

        const hasTx = newHistory[startOfDate].some(({ id }) => sameString(id, newTx.id))
        if (hasTx) {
          continue
        }

        // Sort old and new transactions
        newHistory[startOfDate] = [...newHistory[startOfDate], newTx].sort((a, b) => b.timestamp - a.timestamp)
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
      let newNext: StoreStructure['history'] = Object.assign({}, state[chainId]?.[safeAddress]?.queued?.next)
      const newQueued: StoreStructure['history'] = Object.assign({}, state[chainId]?.[safeAddress]?.queued?.queued)

      let label: keyof StoreStructure['queued'] | undefined

      for (const value of values) {
        if (isLabel(value)) {
          label = value.label.toLowerCase() as typeof label
          continue
        }

        if (
          // Conflict headers are not needed in the current implementation
          isConflictHeader(value) ||
          // Only multisig transaction summaries are added to queued
          !isTransactionSummary(value) ||
          !isMultisigExecutionInfo(value.transaction.executionInfo)
        ) {
          continue
        }

        const newTx = value.transaction
        const txNonce = value.transaction.executionInfo?.nonce

        if (txNonce === undefined) {
          console.warn('A transaction without a nonce was provided by the CGW:', JSON.stringify(value))
          continue
        }

        if (label === 'queued') {
          newQueued[txNonce] ? updateQueuedTxGroup(newQueued, newTx, txNonce) : [newTx]
        } else {
          newNext = newNext[txNonce] ? updateQueuedTxGroup(newNext, newTx, txNonce) : { [txNonce]: [newTx] }
          delete newQueued?.[txNonce]
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

      const storedTransactions = Object.freeze(Object.assign({}, state[chainId][safeAddress]))
      const newQueued = storedTransactions.queued
      let newHistory = storedTransactions.history

      const txGroup: StoreStructure['queued']['next' | 'queued'] | StoreStructure['history'] = get(
        storedTransactions,
        txLocation,
      )

      for (const [timestamp, transactions] of Object.entries(txGroup)) {
        const txIndex = transactions.findIndex(({ id }) => sameString(id, transactionId))
        const hasTx = txIndex >= 0

        if (hasTx) {
          txGroup[timestamp][txIndex]['txDetails'] = value
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
      // If we provide the id, that transaction will be "PENDING"
      // otherwise all same-nonced transactions will be "PENDING"
      const { chainId, nonce, id, safeAddress, txStatus } = action.payload
      const storedTxs = Object.freeze(Object.assign({}, state[chainId][safeAddress]))
      const { queued: newQueued, history: newHistory } = storedTxs

      let txLocation: keyof StoreStructure['queued'] | keyof Pick<StoreStructure, 'history'> | undefined
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
          const hasTx = txIndex >= 0

          if (!hasTx) {
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
