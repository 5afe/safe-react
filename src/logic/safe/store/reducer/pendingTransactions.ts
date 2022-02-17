import { Action, handleActions } from 'redux-actions'

import session from 'src/utils/storage/session'
import { PENDING_TRANSACTIONS_ACTIONS } from 'src/logic/safe/store/actions/pendingTransactions'
import { ChainId } from 'src/config/chain.d'
import { _getChainId } from 'src/config'

export const PENDING_TRANSACTIONS_ID = 'pendingTransactions'

export type PendingTransactionsState = Record<ChainId, Record<string, string | boolean>>

const initialPendingTxsState = session.getItem<PendingTransactionsState>(PENDING_TRANSACTIONS_ID) || {}

export type RemovePendingTransactionPayload = {
  id: string
  isBroadcast?: boolean
}

export type AddPendingTransactionPayload = RemovePendingTransactionPayload & {
  txHash: string | boolean
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

      return {
        ...state,
        [chainId]: newChainState,
      }
    },
  },
  initialPendingTxsState,
)
