import { List } from 'immutable'

import { isPendingTransaction } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { isStatusAwaitingConfirmation } from 'src/logic/safe/store/models/types/gateway.d'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { Transaction as GatewayTransaction } from 'src/logic/safe/store/models/types/gateway'
import { addressInList } from 'src/routes/safe/components/Transactions/GatewayTransactions/utils'
import { CancellationTransactions } from 'src/logic/safe/store/reducer/cancellationTransactions'

export const getAwaitingTransactions = (
  allTransactions: List<Transaction>,
  cancellationTxs: CancellationTransactions,
  userAccount: string,
): List<Transaction> => {
  return allTransactions.filter((tx) => {
    const cancelTx = !!tx.nonce && !isNaN(Number(tx.nonce)) ? cancellationTxs.get(`${tx.nonce}`) : null

    // The transaction is not executed and is not cancelled, nor pending, so it's still waiting confirmations
    if (!tx.executionTxHash && !tx.cancelled && cancelTx && !isPendingTransaction(tx, cancelTx)) {
      // Then we check if the waiting confirmations are not from the current user, otherwise, filters this transaction
      const transactionWaitingUser = tx.confirmations.filter(({ owner }) => owner !== userAccount)
      return transactionWaitingUser.size > 0
    }

    return false
  })
}

export const getAwaitingGatewayTransactions = (
  allTransactions: GatewayTransaction[],
  userAccount: string,
): GatewayTransaction[] => {
  return allTransactions.filter((tx) => {
    // The transaction is not executed and is not cancelled, nor pending, so it's still waiting confirmations
    if (isStatusAwaitingConfirmation(tx.txStatus)) {
      // Then we check if the waiting confirmations are not from the current user, otherwise, filters this transaction
      return addressInList(tx.executionInfo?.missingSigners)(userAccount)
    }

    return false
  })
}
