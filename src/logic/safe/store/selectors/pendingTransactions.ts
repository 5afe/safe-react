import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import {
  isMultiSigExecutionDetails,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { PendingTransactionsState, PENDING_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/pendingTransactions'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ChainId } from 'src/config/chain'

export const allPendingTxs = (state: AppReduxState): PendingTransactionsState => {
  return state[PENDING_TRANSACTIONS_ID]
}

const pendingTxsByChain = createSelector(
  allPendingTxs,
  currentChainId,
  (statuses, chainId): PendingTransactionsState[ChainId] => {
    return statuses[chainId]
  },
)

export const isTxPending = createSelector(
  pendingTxsByChain,
  (_: AppReduxState, safeTxHash: string) => safeTxHash,
  (pendingTxs: PendingTransactionsState[ChainId], safeTxHash: string): boolean => {
    return pendingTxs ? !!pendingTxs?.[safeTxHash] : false
  },
)

// @FIXME: this is a dirty hack.
// Ask backend to add safeTxHash in tx list items.
export const getSafeTxHashFromId = (id: string): string => {
  return id.split('_').pop() || ''
}

export const selectTxStatus = createSelector(
  pendingTxsByChain,
  (_: AppReduxState, tx: Transaction) => tx,
  (pendingTxs: PendingTransactionsState[ChainId], tx: Transaction): TransactionStatus => {
    const { detailedExecutionInfo } = tx.txDetails || {}

    const safeTxHash =
      detailedExecutionInfo && isMultiSigExecutionDetails(detailedExecutionInfo)
        ? detailedExecutionInfo.safeTxHash
        : getSafeTxHashFromId(tx.id)

    return !!pendingTxs?.[safeTxHash] ? LocalTransactionStatus.PENDING : tx.txStatus
  },
)
