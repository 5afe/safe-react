// @flow
import { List, Map } from 'immutable'
import { type Selector, createSelector } from 'reselect'

import { userAccountSelector } from '~/logic/wallets/store/selectors'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Transaction, type TransactionStatus } from '~/routes/safe/store/models/transaction'
import {
  type RouterProps,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  safeSelector,
  safeTransactionsSelector,
} from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'

const getTxStatus = (tx: Transaction, userAddress: string, safe: Safe): TransactionStatus => {
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

export const extendedTransactionsSelector: Selector<
  GlobalState,
  RouterProps,
  List<Transaction | IncomingTransaction>,
> = createSelector(
  safeSelector,
  userAccountSelector,
  safeTransactionsSelector,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  (safe, userAddress, transactions, cancellationTransactions, incomingTransactions) => {
    const cancellationTransactionsByNonce = cancellationTransactions.reduce((acc, tx) => acc.set(tx.nonce, tx), Map())
    const extendedTransactions = transactions.map((tx: Transaction) =>
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
