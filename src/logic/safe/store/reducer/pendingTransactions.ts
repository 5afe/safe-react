import { Action, handleActions } from 'redux-actions'
import { Set } from 'immutable'

import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS } from 'src/logic/safe/store/actions/pendingTransactions'
import { ChainId } from 'src/config/chain.d'
import { _getChainId } from 'src/config'

export const PENDING_TRANSACTIONS_ID = 'pendingTransactions'

type SafeTxHash = string
export type PendingTransactionsState = Record<ChainId, Set<SafeTxHash>>

const initialPendingTransactionsState: PendingTransactionsState = session.getItem(PENDING_TRANSACTIONS_ID) || {}
export const initialPendingTransactionChainState: PendingTransactionsState[ChainId] = Set<SafeTxHash>()

export type PendingTransactionPayload = {
  safeTxHash: string
  isBroadcast?: boolean
}

export const pendingTransactionsReducer = handleActions<PendingTransactionsState, PendingTransactionPayload>(
  {
    [PENDING_TRANSACTIONS_ACTIONS.ADD]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()

      const prevChainState = state[chainId] || initialPendingTransactionChainState
      const newChainState = prevChainState.add(action.payload.safeTxHash)

      return {
        ...state,
        [chainId]: newChainState,
      }
    },
    [PENDING_TRANSACTIONS_ACTIONS.REMOVE]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()

      if (!state[chainId]) {
        return state
      }

      const prevChainState = Set(state[chainId] || initialPendingTransactionChainState)
      const newChainState = prevChainState.delete(action.payload.safeTxHash)
      return {
        ...state,
        [chainId]: newChainState,
      }
    },
  },
  initialPendingTransactionsState,
)
