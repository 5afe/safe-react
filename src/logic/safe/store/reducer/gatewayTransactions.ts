import get from 'lodash.get'
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
} from 'src/logic/safe/store/models/types/gateway.d'
import { UPDATE_TRANSACTION_DETAILS } from 'src/logic/safe/store/actions/fetchTransactionDetails'

import { AppReduxState } from 'src/store'
import { getUTCStartOfDate } from 'src/utils/date'
import { sameString } from 'src/utils/strings'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

type BasePayload = { safeAddress: string }
export type HistoryPayload = BasePayload & { values: HistoryGatewayResponse['results'] }
export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }
export type TransactionDetailsPayload = {
  safeAddress: string
  txLocation: 'history' | 'queued.next' | 'queued.queued'
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
      const { safeAddress, values } = action.payload
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
          history,
        },
      }
    },
    [ADD_QUEUED_TRANSACTIONS]: (state, action: Action<QueuedPayload>) => {
      const { safeAddress, values } = action.payload
      const queued: StoreStructure['queued'] = {
        queued: {},
        next: {},
      }

      let inLabelGroup: Label['label'] = 'Next'
      values.forEach((value) => {
        if (isLabel(value)) {
          inLabelGroup = value.label
        }

        if (isTransactionSummary(value)) {
          const txNonce = value.transaction.executionInfo?.nonce

          if (!txNonce) {
            return
          }

          const label = inLabelGroup.toLowerCase()
          queued[label][txNonce] = [...(queued[label][txNonce] ?? []), value.transaction]
        }
      })

      return {
        // all the safes with their respective states
        ...state,
        // current safe
        [safeAddress]: {
          // keep history list
          ...state[safeAddress],
          // overwrites queued lists
          queued,
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
