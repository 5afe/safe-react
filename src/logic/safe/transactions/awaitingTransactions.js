// @flow
import { Map, List } from 'immutable'
import type { Transaction } from '~/routes/safe/store/models/transaction'

export const getAwaitingTransactions = (
  allTransactions: Map<string, List<Transaction>>,
  cancellationTransactionsByNonce: Map<string | number, List<Transaction>>,
  userAccount: string,
): Map<string, List<Transaction>> => {
  if (!allTransactions) {
    return Map({})
  }

  const allAwaitingTransactions = allTransactions.map((safeTransactions) => {
    const nonCancelledTransactions = safeTransactions.filter(
      (transaction: Transaction) => {
        // If transactions are not executed, but there's a transaction with the same nonce EXECUTED later
        // it means that the transaction was cancelled (Replaced) and shouldn't get executed
        if (!transaction.isExecuted) {
          if (cancellationTransactionsByNonce.get(transaction.nonce)) {
            // eslint-disable-next-line no-param-reassign
            transaction = transaction.set('cancelled', true)
          }
        }
        // The transaction is not executed and is not cancelled, so it's still waiting confirmations
        if (!transaction.executionTxHash && !transaction.cancelled) {
          // Then we check if the waiting confirmations are not from the current user, otherwise, filters this
          // transaction
          const transactionWaitingUser = transaction.confirmations.filter(
            (confirmation) => confirmation.owner && confirmation.owner.address !== userAccount,
          )

          return transactionWaitingUser.size > 0
        }
        return false
      },
    )
    return nonCancelledTransactions
  })

  return allAwaitingTransactions
}
