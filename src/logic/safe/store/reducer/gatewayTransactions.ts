import { MultisigExecutionInfo, TransactionStatus, TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'
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

import { AppReduxState } from 'src/store'
import { getLocalStartOfDate } from 'src/utils/date'
import { sameString } from 'src/utils/strings'
import { sortObject } from 'src/utils/objects'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

type BasePayload = { chainId: string; safeAddress: string; isTail?: boolean }
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

const findTransactionLocation = (
  transactionsGroup: { [p: number]: Transaction[] },
  transactionId: string,
): { key: string; index: number } => {
  let key
  let index
  let transactions

  for ([key, transactions] of Object.entries(transactionsGroup)) {
    index = transactions.findIndex(({ id }) => sameString(id, transactionId))

    if (index !== -1) {
      break
    }
  }

  return { key, index }
}

export const gatewayTransactions = handleActions<AppReduxState['gatewayTransactions'], Payload>(
  {
    [ADD_HISTORY_TRANSACTIONS]: (state, action: Action<HistoryPayload>) => {
      const { chainId, safeAddress, values, isTail = false } = action.payload
      const history: StoreStructure['history'] = Object.assign({}, state[chainId]?.[safeAddress]?.history)

      values.forEach((value) => {
        if (isDateLabel(value)) {
          // DATE_LABEL is discarded as it's not needed for the current implementation
          return
        }

        if (isTransactionSummary(value)) {
          const transaction = (value as any).transaction as TransactionSummary
          const startOfDate = getLocalStartOfDate(transaction.timestamp)

          if (typeof history[startOfDate] === 'undefined') {
            history[startOfDate] = []
          }

          const txExist = history[startOfDate].some(({ id }) => sameString(id, transaction.id))

          if (!txExist) {
            history[startOfDate].push(transaction)
            // pushing a newer transaction to the existing list messes the transactions order
            // this happens when most recent transactions are added to the existing txs in the store
            history[startOfDate] = history[startOfDate].sort((a, b) => b.timestamp - a.timestamp)
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
            history: isTail ? history : sortObject(history, 'desc'),
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
      let next = Object.assign({}, state[chainId]?.[safeAddress]?.queued?.next)
      const queued = Object.assign({}, state[chainId]?.[safeAddress]?.queued?.queued)

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
            label = next[txNonce] ? 'next' : 'queued'
          }

          switch (label) {
            case 'next': {
              if (next[txNonce]) {
                const txIndex = next[txNonce].findIndex(({ id }) => sameString(id, value.transaction.id))

                if (txIndex !== -1) {
                  const storedTransaction = next[txNonce][txIndex]
                  const updateFromService =
                    (storedTransaction.executionInfo as MultisigExecutionInfo).confirmationsSubmitted !==
                    value.transaction.executionInfo?.confirmationsSubmitted

                  if (storedTransaction.txStatus === TransactionStatus.PENDING && !updateFromService) {
                    // we're waiting for a tx resolution. Thus, we'll prioritize TransactionStatus.PENDING status
                    value.transaction.txStatus = TransactionStatus.PENDING
                  }

                  next[txNonce][txIndex] = updateFromService
                    ? // by replacing the current transaction with the one returned by the service
                      // we remove the `txDetails`, so this will force a re-request of the data
                      value.transaction
                    : // we merge, to keep the current unchanged information
                      merge(storedTransaction, value.transaction)
                  break
                }

                // we add the transaction returned by the service to the list of transactions
                next[txNonce] = [...next[txNonce], value.transaction]
                break
              }

              // a new tx has arrived to the `next` queue
              // we re-create the `next` object with the new transaction
              next = { [txNonce]: [value.transaction] }

              // we remove the new `next` transaction from the `queue` list, if it exist
              queued[txNonce] && delete queued[txNonce]

              break
            }
            case 'queued': {
              if (queued[txNonce]) {
                const txIndex = queued[txNonce].findIndex(({ id }) => sameString(id, value.transaction.id))

                if (txIndex !== -1) {
                  const storedTransaction = queued[txNonce][txIndex]
                  const updateFromService =
                    (storedTransaction.executionInfo as MultisigExecutionInfo).confirmationsSubmitted !==
                    value.transaction.executionInfo?.confirmationsSubmitted

                  if (storedTransaction.txStatus === TransactionStatus.PENDING && !updateFromService) {
                    // we're waiting for a tx resolution. Thus, we'll prioritize TransactionStatus.PENDING status
                    value.transaction.txStatus = TransactionStatus.PENDING
                  }

                  queued[txNonce][txIndex] = updateFromService
                    ? // by replacing the current transaction with the one returned by the service
                      // we remove the `txDetails`, so this will force a re-request of the data
                      value.transaction
                    : // we merge, to keep the current unchanged information
                      merge(storedTransaction, value.transaction)
                  break
                }

                // we add the transaction returned by the service to the list of transactions
                queued[txNonce] = [...queued[txNonce], value.transaction]
                break
              }

              queued[txNonce] = [value.transaction]
              break
            }
          }
          return
        }
      })

      // no new transactions
      if (!values.length) {
        // queued list already empty
        if (!Object.keys(queued).length) {
          // there was an existing next transaction
          if (Object.keys(next).length === 1) {
            // we cleanup the next queue
            next = {}
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
              next,
              queued,
            },
          },
        },
      }
    },
    [UPDATE_TRANSACTION_DETAILS]: (state, action: Action<TransactionDetailsPayload>) => {
      const { chainId, safeAddress, transactionId, txLocation, value } = action.payload
      const storedTransactions = Object.assign({}, state[chainId][safeAddress])
      const { queued } = storedTransactions
      let { history } = storedTransactions

      // get the tx group (it will be `queued.next`, `queued.queued` or `history`)
      const txGroup: StoreStructure['queued']['next' | 'queued'] | StoreStructure['history'] = get(
        storedTransactions,
        txLocation,
      )

      // find the transaction location
      const { key, index } = findTransactionLocation(txGroup, transactionId)
      // add details to tx object
      txGroup[key][index]['txDetails'] = value

      // replace the updated group in its corresponding location
      switch (txLocation) {
        case 'history':
          history = txGroup
          break
        case 'queued.next':
          queued['next'] = txGroup
          break
        case 'queued.queued':
          queued['queued'] = txGroup
          break
      }

      // update state
      return {
        // all the safes with their respective states
        ...state,
        [chainId]: {
          // current safe
          [safeAddress]: {
            history,
            queued,
          },
        },
      }
    },
    [UPDATE_TRANSACTION_STATUS]: (state, action: Action<TransactionStatusPayload>) => {
      // if we provide the tx ID that sole tx will have the _pending_ status.
      // if not, all the txs that share the same nonce will have the _pending_ status.
      const { chainId, nonce, id, safeAddress, txStatus } = action.payload
      const storedTransactions = Object.assign({}, state[chainId][safeAddress])
      const { queued } = storedTransactions
      const { history } = storedTransactions

      let txLocation: TxLocation | undefined
      let historyLocation: string | undefined

      if (queued.next[nonce]) {
        txLocation = 'queued.next'
      } else if (queued.queued[nonce]) {
        txLocation = 'queued.queued'
      } else {
        Object.entries(history).forEach(([timestamp, transactions]) => {
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
            const txToUpdate = get(history, historyLocation)
            txToUpdate.txStatus = txStatus
          }
          break
        }
        case 'queued.next': {
          queued.next[nonce] = queued.next[nonce].map((txToUpdate) => {
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
          queued.queued[nonce] = queued.queued[nonce].map((txToUpdate) => {
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
            history,
            queued,
          },
        },
      }
    },
  },
  {},
)
