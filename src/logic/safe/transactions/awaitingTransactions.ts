import { List } from 'immutable'

import { isPendingTransaction } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'

export const getAwaitingTransactions = (
  allTransactions: List<Transaction>,
  cancellationTxs,
  userAccount: string,
): List<Transaction> => {
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
