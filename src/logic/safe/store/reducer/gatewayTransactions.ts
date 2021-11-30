import { MultisigExecutionInfo, TransactionStatus, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
import get from 'lodash/get'
import merge from 'lodash/merge'
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
          },
        },
      }
    },
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      // we're assuming that `next` and `queued` labels will be provided in the first page
      // as for usage experience there were no more than 5 transactions competing for the same nonce.
      // Thus, given the client-gateway page size of 20, we have plenty of "room" to be provided with
      // `next` and `queued` transactions in the first page.
      const { chainId, safeAddress, values } = action.payload
      let newNext = cloneDeep(state[chainId]?.[safeAddress]?.queued?.next || {})
      const newQueued = cloneDeep(state[chainId]?.[safeAddress]?.queued?.queued || {})

      let label: 'next' | 'queued' | undefined
      values.forEach((value) => {
        if (isLabel(value)) {
          // we're assuming that the first page will always provide `next` and `queued` labels
          label = value.label.toLowerCase() as 'next' | 'queued'
          return
        }

        if (isConflictHeader(value)) {
          // conflict header is discarded as it's not needed for the current implementation
          return
        }

        if (isTransactionSummary(value) && isMultisigExecutionInfo(value.transaction.executionInfo)) {
          const txNonce = value.transaction.executionInfo?.nonce

          if (typeof txNonce === 'undefined') {
            console.warn('A transaction without nonce was provided by client-gateway:', JSON.stringify(value))
            return
          }

          if (typeof label === 'undefined') {
            label = newNext[txNonce] ? 'next' : 'queued'
          }

          switch (label) {
            case 'next': {
              if (newNext[txNonce]) {
                const txIndex = newNext[txNonce].findIndex(({ id }) => sameString(id, value.transaction.id))

                if (txIndex !== -1) {
                  const storedTransaction = newNext[txNonce][txIndex]
                  const updateFromService =
                    (storedTransaction.executionInfo as MultisigExecutionInfo).confirmationsSubmitted !==
                    value.transaction.executionInfo?.confirmationsSubmitted

                  if (storedTransaction.txStatus === TransactionStatus.PENDING && !updateFromService) {
                    // we're waiting for a tx resolution. Thus, we'll prioritize TransactionStatus.PENDING status
                    value.transaction.txStatus = TransactionStatus.PENDING
                  }

                  newNext[txNonce][txIndex] = updateFromService
                    ? // by replacing the current transaction with the one returned by the service
                      // we remove the `txDetails`, so this will force a re-request of the data
                      value.transaction
                    : // we merge, to keep the current unchanged information
                      merge(storedTransaction, value.transaction)
                  break
                }

                // we add the transaction returned by the service to the list of transactions
                newNext[txNonce] = [...newNext[txNonce], value.transaction]
                break
              }

              // a new tx has arrived to the `next` queue
              // we re-create the `next` object with the new transaction
              newNext = { [txNonce]: [value.transaction] }

              // we remove the new `next` transaction from the `queue` list, if it exist
              newQueued[txNonce] && delete newQueued[txNonce]

              break
            }
            case 'queued': {
              if (newQueued[txNonce]) {
                const txIndex = newQueued[txNonce].findIndex(({ id }) => sameString(id, value.transaction.id))

                if (txIndex !== -1) {
                  const storedTransaction = newQueued[txNonce][txIndex]
                  const updateFromService =
                    (storedTransaction.executionInfo as MultisigExecutionInfo).confirmationsSubmitted !==
                    value.transaction.executionInfo?.confirmationsSubmitted

                  if (storedTransaction.txStatus === TransactionStatus.PENDING && !updateFromService) {
                    // we're waiting for a tx resolution. Thus, we'll prioritize TransactionStatus.PENDING status
                    value.transaction.txStatus = TransactionStatus.PENDING
                  }

                  newQueued[txNonce][txIndex] = updateFromService
                    ? // by replacing the current transaction with the one returned by the service
                      // we remove the `txDetails`, so this will force a re-request of the data
                      value.transaction
                    : // we merge, to keep the current unchanged information
                      merge(storedTransaction, value.transaction)
                  break
                }

                // we add the transaction returned by the service to the list of transactions
                newQueued[txNonce] = [...newQueued[txNonce], value.transaction]
                break
              }

              newQueued[txNonce] = [value.transaction]
              break
            }
          }
          return
        }
      })

      // no new transactions
      if (!values.length) {
        // queued list already empty
        if (newQueued && !Object.keys(newQueued).length) {
          // there was an existing next transaction
          if (Object.keys(newNext).length === 1) {
            // we cleanup the next queue
            newNext = {}
          }
        }
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
