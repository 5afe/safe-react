import { Action, handleActions } from 'redux-actions'

import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS } from 'src/logic/safe/store/actions/pendingTransactions'
import { ChainId } from 'src/config/chain.d'
import { _getChainId } from 'src/config'

export const PENDING_TRANSACTIONS_ID = 'pendingTransactions'

export type PendingTransactionsState = Record<ChainId, Record<string, string>>

const initialPendingTxsState = session.getItem<PendingTransactionsState>(PENDING_TRANSACTIONS_ID) || {}

export type RemovePendingTransactionPayload = {
  id: string
  isBroadcast?: boolean
}

export type AddPendingTransactionPayload = RemovePendingTransactionPayload & {
  txHash: string
}

export type PendingTransactionPayloads = AddPendingTransactionPayload | RemovePendingTransactionPayload

export const pendingTransactionsReducer = handleActions<PendingTransactionsState, PendingTransactionPayloads>(
  {
    [PENDING_TRANSACTIONS_ACTIONS.ADD]: (
      state: PendingTransactionsState,
      action: Action<AddPendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()
      const { id, txHash } = action.payload

      return {
        ...state,
        [chainId]: { ...state[chainId], [id]: txHash },
      }
    },
    [PENDING_TRANSACTIONS_ACTIONS.REMOVE]: (
      state: PendingTransactionsState,
      action: Action<RemovePendingTransactionPayload>,
    ) => {
      const chainId = _getChainId()
      const { id } = action.payload

      // Omit id from the pending transactions on current chain
      const { [id]: _, ...newChainState } = state[chainId] || {}

      if (Object.keys(newChainState[chainId] || {}).length === 0) {
        // Omit chainId from the pending transactions if no pending transactions on chain
        const { [chainId]: _, ...newState } = state
        return newState
      }

      return {
        ...state,
        [chainId]: newChainState,
      }
    },
  },
  initialPendingTxsState,
)
