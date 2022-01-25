import { TransactionStatus } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'
import { AppReduxState } from 'src/store'
import {
  isMultiSigExecutionDetails,
  LocalTransactionStatus,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { PendingTransactionsState, PENDING_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/pendingTransactions'

export const localStatuses = (state: AppReduxState): PendingTransactionsState => {
  return state[PENDING_TRANSACTIONS_ID]
}

// @FIXME: this is a dirty hack.
// Ask backend to add safeTxHash in tx list items.
const getSafeTxHashFromId = (id: string): string => {
  return id.split('_').pop() || ''
}

export const getLocalTxStatus = (pendingTxs: PendingTransactionsState, tx: Transaction): TransactionStatus => {
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
  localStatuses,
  (_: AppReduxState, tx: Transaction): Transaction => tx,
  (pendingTxs: PendingTransactionsState, tx: Transaction): TransactionStatus => {
    return getLocalTxStatus(pendingTxs, tx)
  },
)
