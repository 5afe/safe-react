import get from 'lodash.get'
import merge from 'lodash.merge'
import { Action, handleActions } from 'redux-actions'

import {
  ADD_HISTORY_TRANSACTIONS,
  ADD_QUEUED_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import {
  HistoryGatewayResponse,
  isLabel,
  isTransactionSummary,
  Label,
  QueuedGatewayResponse,
  StoreStructure,
  Transaction,
  TxLocation,
} from 'src/logic/safe/store/models/types/gateway.d'
import { UPDATE_TRANSACTION_DETAILS } from 'src/logic/safe/store/actions/fetchTransactionDetails'

import { AppReduxState } from 'src/store'
import { getUTCStartOfDate } from 'src/utils/date'
import { sameString } from 'src/utils/strings'
import { sortObject } from 'src/utils/objects'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

type BasePayload = { safeAddress: string; isTail?: boolean }
export type HistoryPayload = BasePayload & { values: HistoryGatewayResponse['results'] }
export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }
export type TransactionDetailsPayload = {
  safeAddress: string
  txLocation: TxLocation
  transactionId: string
  value: Transaction['txDetails']
}

type Payload = HistoryPayload | QueuedPayload | TransactionDetailsPayload

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
      const { safeAddress, values, isTail = false } = action.payload
      const history: StoreStructure['history'] = Object.assign({}, state[safeAddress]?.history)

      values.forEach((value) => {
        if (isTransactionSummary(value)) {
          const startOfDate = getUTCStartOfDate(value.transaction.timestamp)

          if (typeof history[startOfDate] === 'undefined') {
            history[startOfDate] = []
          }

          const txExist = history[startOfDate].some(({ id }) => sameString(id, value.transaction.id))

          if (!txExist) {
            history[startOfDate].push(value.transaction)
            // pushing a newer transaction to the existing list messes the transactions order
            // this happens when most recent transactions are added to the existing txs in the store
            history[startOfDate] = history[startOfDate].sort((a, b) => b.timestamp - a.timestamp)
          }
        }
      })

      return {
        // all the safes with their respective states
        ...state,
        // current safe
        [safeAddress]: {
          // keep queued list
          ...state[safeAddress],
          // extend history list
          history: isTail ? history : sortObject(history, 'desc'),
        },
      }
    },
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      // we're assuming that `next` and `queued` labels will be provided in the first page
      // as for usage experience there were no more than 5 transactions competing for the same nonce.
      // Thus, given the client-gateway page size of 20, we have plenty of "room" to be provided with
      // `next` and `queued` transactions in the first page.
      const { safeAddress, values } = action.payload
      let next = Object.assign({}, state[safeAddress]?.queued?.next)
      const queued = Object.assign({}, state[safeAddress]?.queued?.queued)

      let label: 'next' | 'queued' | undefined
      values.forEach((value) => {
        if (isLabel(value)) {
          // we're assuming that the first page will always provide `next` and `queued` labels
          label = value.label.toLowerCase() as 'next' | 'queued'
        } else if (isTransactionSummary(value)) {
          const txNonce = value.transaction.executionInfo?.nonce

          if (!txNonce) {
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
                  next[txNonce][txIndex] = merge(next[txNonce][txIndex], value.transaction)
                  break
                }

                next[txNonce] = [...next[txNonce], value.transaction]
                break
              }

              next = { [txNonce]: [value.transaction] }
              queued[txNonce] && delete queued[txNonce]
              break
            }
            case 'queued': {
              if (queued[txNonce]) {
                const txIndex = queued[txNonce].findIndex(({ id }) => sameString(id, value.transaction.id))

                if (txIndex !== -1) {
                  queued[txNonce][txIndex] = merge(queued[txNonce][txIndex], value.transaction)
                  break
                }

                queued[txNonce] = [...queued[txNonce], value.transaction]
                break
              }

              queued[txNonce] = [value.transaction]
              break
            }
          }
        }
        // conflict header is discarded
      })

      return {
        // all the safes with their respective states
        ...state,
        // current safe
        [safeAddress]: {
          // keep history list
          ...state[safeAddress],
          // overwrites queued lists
          queued: {
            next,
            queued,
          },
        },
      }
    },
    [UPDATE_TRANSACTION_DETAILS]: (state, action: Action<TransactionDetailsPayload>) => {
      const { safeAddress, transactionId, txLocation, value } = action.payload
      const { queued } = state[safeAddress]
      let { history } = state[safeAddress]

      // get the tx group (it will be `queued.next`, `queued.queued` or `history`)
      const txGroup: StoreStructure['queued']['next' | 'queued'] | StoreStructure['history'] = get(
        state[safeAddress],
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
        // current safe
        [safeAddress]: {
          history,
          queued,
        },
      }
    },
  },
  {},
)
