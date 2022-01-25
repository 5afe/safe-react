import { Action, handleActions } from 'redux-actions'

import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS } from 'src/logic/safe/store/actions/pendingTransactions'
import { ChainId } from 'src/config/chain.d'
import { _getChainId } from 'src/config'

type SafeTxHash = string
export type PendingTransactionsState = Record<ChainId, Set<SafeTxHash>>

export type PendingTransactionPayload = {
  safeTxHash: string
  isBroadcast?: boolean
}

export const PENDING_TRANSACTIONS_ID = 'pendingTransactions'

const initialPendingTransactionsState: PendingTransactionsState = session.getItem(PENDING_TRANSACTIONS_ID) || {}

export const pendingTransactionsReducer = handleActions<PendingTransactionsState, PendingTransactionPayload>(
  {
    [PENDING_TRANSACTIONS_ACTIONS.ADD]: (
      state: PendingTransactionsState,
      action: Action<PendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()

      const prevChainState = state[chainId] || new Set()
      const newChainState = new Set([...prevChainState, action.payload.safeTxHash])

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

      // Remove entire chain if the only left pending transaction
      if (state[chainId].size === 1 && state[chainId].has(action.payload.safeTxHash)) {
        const { [chainId]: _, ...newState } = state
        return newState
      }

      // Remove singular pending transaction
      const newChainState = new Set(state[chainId])
      newChainState.delete(action.payload.safeTxHash)
      return {
        ...state,
        [chainId]: newChainState,
      }
    },
  },
  initialPendingTransactionsState,
)
