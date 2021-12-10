import { MultisigExecutionInfo, TransactionStatus, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { Action, handleActions } from 'redux-actions'

import {
  ADD_HISTORY_TRANSACTIONS,
  ADD_QUEUED_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { UPDATE_TRANSACTION_STATUS } from 'src/logic/safe/store/actions/updateTransactionStatus'
import {
  HistoryGatewayResponse,
  isConflictHeader,
  isDateLabel,
  isLabel,
  isMultisigExecutionInfo,
  isStatusPending,
  isTransactionSummary,
  QueuedGatewayResponse,
  StoreStructure,
  Transaction,
  TxLocation,
} from 'src/logic/safe/store/models/types/gateway.d'
import { UPDATE_TRANSACTION_DETAILS } from 'src/logic/safe/store/actions/fetchTransactionDetails'

import { getLocalStartOfDate } from 'src/utils/date'
import { sameString } from 'src/utils/strings'
import { sortObject } from 'src/utils/objects'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

type GatewayTransactionsState = Record<string, Record<string, StoreStructure>>

type BasePayload = { chainId: string; safeAddress: string; isTail?: boolean }
export type HistoryPayload = BasePayload & { values: HistoryGatewayResponse['results'] }
export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }
export type TransactionDetailsPayload = {
  chainId: string
  safeAddress: string
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

export const gatewayTransactionsReducer = handleActions<GatewayTransactionsState, Payload>(
  {
    [ADD_HISTORY_TRANSACTIONS]: (state, action: Action<HistoryPayload>) => {
      const { chainId, safeAddress, values, isTail = false } = action.payload
      const newHistory: StoreStructure['history'] = cloneDeep(state[chainId]?.[safeAddress]?.history || {})
      const newQueued: StoreStructure['queued'] = cloneDeep(state[chainId]?.[safeAddress]?.queued || {})

      values.forEach((value) => {
        if (isDateLabel(value)) {
          // DATE_LABEL is discarded as it's not needed for the current implementation
          return
        }

        if (isTransactionSummary(value)) {
          const transaction = (value as any).transaction as TransactionSummary
          const startOfDate = getLocalStartOfDate(transaction.timestamp)

          if (typeof newHistory[startOfDate] === 'undefined') {
            newHistory[startOfDate] = []
          }

          const txExist = newHistory[startOfDate].some(({ id }) => sameString(id, transaction.id))

          if (!txExist) {
            newHistory[startOfDate].push(transaction)
            // pushing a newer transaction to the existing list messes the transactions order
            // this happens when most recent transactions are added to the existing txs in the store
            newHistory[startOfDate] = newHistory[startOfDate].sort((a, b) => b.timestamp - a.timestamp)

            // remove tx from queued if it exists there
            if (isMultisigExecutionInfo(transaction.executionInfo)) {
              console.log(transaction.executionInfo.nonce)
              const txNonce = transaction.executionInfo.nonce

              if (newQueued?.queued && newQueued?.queued[txNonce]) {
                delete newQueued.queued[txNonce]
              }
            }
          }
          return
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
            queued: {
              ...state[chainId]?.[safeAddress].queued,
              queued: newQueued.queued,
            },
          },
        },
      }
    },
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      const { chainId, safeAddress, values } = action.payload
      let newNext = {}
      let newQueued = {}

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

        const newTx = value.transaction
        if (label === 'queued') {
          const oldQueued = state[chainId]?.[safeAddress]?.queued?.queued || {}
          const prevTx = oldQueued?.[txNonce]?.find(({ id }) => sameString(id, newTx.id))
          if (prevTx && isStatusPending(prevTx.txStatus)) {
            // Prioritize "PENDING" transactions as awaiting resolution
            newTx.txStatus = TransactionStatus.PENDING
          }

          if (newQueued?.[txNonce]) {
            newQueued[txNonce] = [...newQueued[txNonce], newTx]
          } else {
            newQueued = { ...newQueued, [txNonce]: [newTx] }
          }
        } else {
          const oldNext = state[chainId]?.[safeAddress]?.queued?.next || {}
          const prevTx = oldNext?.[txNonce]?.find(({ id }) => sameString(id, newTx.id))
          if (prevTx && isStatusPending(prevTx.txStatus)) {
            // Prioritize "PENDING" transactions as awaiting resolution
            newTx.txStatus = TransactionStatus.PENDING
          }
          newNext = { [txNonce]: [newTx] }
        }
      })

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
    [UPDATE_TRANSACTION_DETAILS]: (state, action: Action<TransactionDetailsPayload>) => {
      const { chainId, safeAddress, transactionId, value } = action.payload
      const clonedStoredTxs = cloneDeep(state[chainId]?.[safeAddress])
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
    [UPDATE_TRANSACTION_STATUS]: (state, action: Action<TransactionStatusPayload>) => {
      // if we provide the tx ID that sole tx will have the _pending_ status.
      // if not, all the txs that share the same nonce will have the _pending_ status.
      const { chainId, nonce, id, safeAddress, txStatus } = action.payload
      const clonedStoredTxs = cloneDeep(state[chainId]?.[safeAddress])
      const { queued: newQueued, history: newHistory } = clonedStoredTxs

      let txLocation: TxLocation | undefined
      let historyLocation: string | undefined

      if (newQueued.next[nonce]) {
        txLocation = 'queued.next'
      } else if (newQueued.queued[nonce]) {
        txLocation = 'queued.queued'
      } else {
        Object.entries(newHistory).forEach(([timestamp, transactions]) => {
          const txIndex = transactions.findIndex(
            (transaction) => Number((transaction.executionInfo as MultisigExecutionInfo).nonce) === nonce,
          )

          if (txIndex !== -1) {
            txLocation = 'history'
            historyLocation = `${timestamp}[${txIndex}]`
          }
        })
      }

      if (!txLocation) {
        return state
      }

      switch (txLocation) {
        case 'history': {
          if (historyLocation) {
            const txToUpdate = get(newHistory, historyLocation)
            txToUpdate.txStatus = txStatus
          }
          break
        }
        case 'queued.next': {
          newQueued.next[nonce] = newQueued.next[nonce].map((txToUpdate) => {
            // prevent setting `PENDING_FAILED` status, if previous status wasn't `PENDING`
            if (txStatus === TransactionStatus.PENDING_FAILED && txToUpdate.txStatus !== TransactionStatus.PENDING) {
              return txToUpdate
            }

            if (typeof id !== 'undefined') {
              if (sameString(txToUpdate.id, id)) {
                txToUpdate.txStatus = txStatus
              }
            } else {
              txToUpdate.txStatus = txStatus
            }
            return txToUpdate
          })
          break
        }
        case 'queued.queued': {
          newQueued.queued[nonce] = newQueued.queued[nonce].map((txToUpdate) => {
            // TODO: review if is this `PENDING` status required under `queued.queued` list
            // prevent setting `PENDING_FAILED` status, if previous status wasn't `PENDING`
            if (txStatus === TransactionStatus.PENDING_FAILED && txToUpdate.txStatus !== TransactionStatus.PENDING) {
              return txToUpdate
            }

            if (typeof id !== 'undefined') {
              if (sameString(txToUpdate.id, id)) {
                txToUpdate.txStatus = txStatus
              }
            } else {
              txToUpdate.txStatus = txStatus
            }
            return txToUpdate
          })
          break
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
