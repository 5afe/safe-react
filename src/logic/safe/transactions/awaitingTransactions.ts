import { List } from 'immutable'

import { isPendingTransaction } from 'src/routes/safe/store/actions/transactions/utils/transactionHelpers'

export const getAwaitingTransactions = (allTransactions = List([]), cancellationTxs, userAccount: string) => {
  return allTransactions.filter((tx) => {
    const cancelTx = !!tx.nonce && !isNaN(Number(tx.nonce)) ? cancellationTxs.get(`${tx.nonce}`) : null

    // The transaction is not executed and is not cancelled, nor pending, so it's still waiting confirmations
    if (!tx.executionTxHash && !tx.cancelled && !isPendingTransaction(tx, cancelTx)) {
      // Then we check if the waiting confirmations are not from the current user, otherwise, filters this transaction
      const transactionWaitingUser = tx.confirmations.filter(({ owner }) => owner !== userAccount)
      return transactionWaitingUser.size > 0
    }

    return false
  })
}
