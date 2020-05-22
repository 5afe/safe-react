import { List, Map } from 'immutable'
import { createSelector } from 'reselect'

import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import {
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  safeSelector,
  safeTransactionsSelector,
} from 'src/routes/safe/store/selectors'

const getTxStatus = (tx: any, userAddress: string, safe): string => {
  let txStatus

  if (tx.executionTxHash) {
    txStatus = 'success'
  } else if (tx.cancelled) {
    txStatus = 'cancelled'
  } else if (tx.confirmations.size === safe.threshold) {
    txStatus = 'awaiting_execution'
  } else if (tx.creationTx) {
    txStatus = 'success'
  } else if (!tx.confirmations.size) {
    txStatus = 'pending'
  } else {
    const userConfirmed = tx.confirmations.filter((conf) => conf.owner === userAddress).size === 1
    const userIsSafeOwner = safe.owners.filter((owner) => owner.address === userAddress).size === 1
    txStatus = !userConfirmed && userIsSafeOwner ? 'awaiting_your_confirmation' : 'awaiting_confirmations'
  }

  if (tx.isSuccessful === false) {
    txStatus = 'failed'
  }

  return txStatus
}

export const extendedTransactionsSelector = createSelector(
  safeSelector,
  userAccountSelector,
  safeTransactionsSelector,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  (safe, userAddress, transactions, cancellationTransactions, incomingTransactions) => {
    const cancellationTransactionsByNonce = cancellationTransactions.reduce((acc, tx) => acc.set(tx.nonce, tx), Map())
    const extendedTransactions = transactions.map((tx: any) =>
      tx.withMutations((transaction) => {
        if (!transaction.isExecuted) {
          if (
            (cancellationTransactionsByNonce.get(tx.nonce) &&
              cancellationTransactionsByNonce.get(tx.nonce).get('isExecuted')) ||
            transactions.find((safeTx) => tx.nonce === safeTx.nonce && safeTx.isExecuted)
          ) {
            transaction.set('cancelled', true)
          }
        }
        transaction.set('status', getTxStatus(transaction, userAddress, safe))

        return transaction
      }),
    )

    return List([...extendedTransactions, ...incomingTransactions])
  },
)
