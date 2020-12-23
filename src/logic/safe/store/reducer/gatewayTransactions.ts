import { Action, handleActions } from 'redux-actions'
import {
  ADD_HISTORY_TRANSACTIONS,
  ADD_QUEUED_TRANSACTIONS,
} from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import {
  HistoryGatewayResponse,
  isDateLabel,
  isLabel,
  isTransactionSummary,
  Label,
  QueuedGatewayResponse,
  StoreStructure,
} from 'src/logic/safe/store/models/types/gateway.d'

import { AppReduxState } from 'src/store'

export const GATEWAY_TRANSACTIONS_ID = 'gatewayTransactions'

type BasePayload = { safeAddress: string }
export type HistoryPayload = BasePayload & { values: HistoryGatewayResponse['results'] }
export type QueuedPayload = BasePayload & { values: QueuedGatewayResponse['results'] }

export const gatewayTransactions = handleActions<AppReduxState['gatewayTransactions'], HistoryPayload | QueuedPayload>(
  {
    [ADD_HISTORY_TRANSACTIONS]: (state, action: Action<HistoryPayload>) => {
      const { safeAddress, values } = action.payload
      const history: StoreStructure['history'] = {}

      let currentTimestamp
      values.forEach((value) => {
        if (isDateLabel(value)) {
          currentTimestamp = value.timestamp
          history[currentTimestamp] = []
        }

        if (isTransactionSummary(value) && currentTimestamp) {
          history[currentTimestamp] = [...history[currentTimestamp], value.transaction]
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
          history: { ...state[safeAddress]?.history, ...history },
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
  },
  {},
)
