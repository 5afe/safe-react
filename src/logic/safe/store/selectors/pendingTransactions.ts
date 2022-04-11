import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import { LocalTransactionStatus, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { PendingTransactionsState, PENDING_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/pendingTransactions'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ChainId } from 'src/config/chain'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'

export const allPendingTxIds = (state: AppReduxState): PendingTransactionsState => {
  return state[PENDING_TRANSACTIONS_ID]
}

export const pendingTxIdsByChain = createSelector(
  allPendingTxIds,
  currentChainId,
  (statuses, chainId): PendingTransactionsState[ChainId] => {
    return statuses[chainId]
  },
)

export const pendingTxsByChain = createSelector(
  (state: AppReduxState) => state,
  pendingTxIdsByChain,
  (state: AppReduxState, pendingTxIds: PendingTransactionsState[ChainId]): Transaction[] | undefined => {
    if (!pendingTxIds) {
      return
    }

    const pendingTxs = Object.keys(pendingTxIds).reduce<Transaction[]>((acc, txId) => {
      const tx = getTransactionByAttribute(state, { attributeValue: txId, attributeName: 'id' })

      return tx ? [...acc, tx] : acc
    }, [])

    return pendingTxs.length > 0 ? pendingTxs : undefined
  },
)

export const isTxPending = createSelector(
  pendingTxIdsByChain,
  (_: AppReduxState, id: string) => id,
  (pendingTxs: PendingTransactionsState[ChainId], id: string): boolean => {
    return pendingTxs ? !!pendingTxs?.[id] : false
  },
)

export const selectTxStatus = createSelector(
  pendingTxIdsByChain,
  (_: AppReduxState, tx: Transaction) => tx,
  (pendingTxs: PendingTransactionsState[ChainId], tx: Transaction): TransactionStatus => {
    return !!pendingTxs?.[tx.id] ? LocalTransactionStatus.PENDING : tx.txStatus
  },
)
