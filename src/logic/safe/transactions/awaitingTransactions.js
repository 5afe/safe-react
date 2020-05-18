import { Map } from 'immutable'

export const getAwaitingTransactions = (
  allTransactions,
  cancellationTransactionsByNonce,
  userAccount,
) => {
  if (!allTransactions) {
    return Map({})
  }

  const allAwaitingTransactions = allTransactions.map((safeTransactions) => {
    const nonCancelledTransactions = safeTransactions.filter((transaction) => {
      // If transactions are not executed, but there's a transaction with the same nonce EXECUTED later
      // it means that the transaction was cancelled (Replaced) and shouldn't get executed
      let isTransactionCancelled = false
      if (!transaction.isExecuted) {
        if (cancellationTransactionsByNonce.get(transaction.nonce)) {
          // eslint-disable-next-line no-param-reassign
          isTransactionCancelled = true
        }
      }
      // The transaction is not executed and is not cancelled, so it's still waiting confirmations
      if (!transaction.executionTxHash && !isTransactionCancelled) {
        // Then we check if the waiting confirmations are not from the current user, otherwise, filters this
        // transaction
        const transactionWaitingUser = transaction.confirmations.filter(({ owner }) => owner !== userAccount)

        return transactionWaitingUser.size > 0
      }
      return false
    })
    return nonCancelledTransactions
  })

  return allAwaitingTransactions
}
