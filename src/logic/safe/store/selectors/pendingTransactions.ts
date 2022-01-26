import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import {
  isMultiSigExecutionDetails,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import {
  initialPendingTransactionChainState,
  PendingTransactionsState,
  PENDING_TRANSACTIONS_ID,
} from 'src/logic/safe/store/reducer/pendingTransactions'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ChainId } from 'src/config/chain'

export const pendingTxsByChain = (state: AppReduxState): PendingTransactionsState => {
  return state[PENDING_TRANSACTIONS_ID]
}

export const pendingTxs = createSelector(
  pendingTxsByChain,
  currentChainId,
  (statuses, chainId): PendingTransactionsState[ChainId] => {
    return statuses[chainId] || initialPendingTransactionChainState
  },
)

// @FIXME: this is a dirty hack.
// Ask backend to add safeTxHash in tx list items.
export const getSafeTxHashFromId = (id: string): string => {
  return id.split('_').pop() || ''
}

export const getLocalTxStatus = (pendingTxs: PendingTransactionsState[ChainId], tx: Transaction): TransactionStatus => {
  const isUnknownStatus = [
    LocalTransactionStatus.AWAITING_CONFIRMATIONS,
    LocalTransactionStatus.AWAITING_EXECUTION,
  ].includes(tx.txStatus)

  if (!isUnknownStatus) {
    return tx.txStatus
  }

  const { detailedExecutionInfo } = tx.txDetails || {}

  const safeTxHash =
    detailedExecutionInfo && isMultiSigExecutionDetails(detailedExecutionInfo)
      ? detailedExecutionInfo.safeTxHash
      : getSafeTxHashFromId(tx.id)

  return pendingTxs.has(safeTxHash) ? LocalTransactionStatus.PENDING : tx.txStatus
}

export const selectTxStatus = createSelector(
  pendingTxs,
  (_: AppReduxState, tx: Transaction): Transaction => tx,
  (pendingTxs: PendingTransactionsState[ChainId], tx: Transaction): TransactionStatus => {
    return getLocalTxStatus(pendingTxs, tx)
  },
)
