import { Action, handleActions } from 'redux-actions'

import { _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS } from 'src/logic/safe/store/actions/pendingTransactions'

export type PendingTransactionsState = Record<ChainId, string[]>

export type PendingTransactionPayload = {
  safeTxHash: string
  isBroadcast?: boolean
}

export const PENDING_TRANSACTIONS_ID = 'pendingTransactions'

export const pendingTransactionsReducer = handleActions<PendingTransactionsState, PendingTransactionPayload>(
  {
    [PENDING_TRANSACTIONS_ACTIONS.SET]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()
      const prevPending = state?.[chainId] || []
      return {
        ...state,
        [chainId]: [...prevPending, action.payload.safeTxHash],
      }
    },
    [PENDING_TRANSACTIONS_ACTIONS.CLEAR]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()
      const prevPending = state?.[chainId] || []
      return {
        ...state,
        [chainId]: prevPending?.filter((safeTxHash) => safeTxHash !== action.payload.safeTxHash),
      }
    },
  },
  session.getItem(PENDING_TRANSACTIONS_ID) || {},
)
