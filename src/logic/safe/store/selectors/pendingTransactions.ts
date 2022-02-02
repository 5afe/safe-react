import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
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
  (_: AppReduxState, id: string) => id,
  (pendingTxs: PendingTransactionsState[ChainId], id: string): boolean => {
    return pendingTxs ? !!pendingTxs?.[id] : false
  },
)

export const selectTxStatus = createSelector(
  pendingTxsByChain,
  (_: AppReduxState, tx: Transaction) => tx,
  (pendingTxs: PendingTransactionsState[ChainId], tx: Transaction): TransactionStatus => {
    return !!pendingTxs?.[tx.id] ? LocalTransactionStatus.PENDING : tx.txStatus
  },
)
