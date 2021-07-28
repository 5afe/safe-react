import { isStatusAwaitingConfirmation } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionSummary } from 'src/types/gateway/transactions'
import { addressInList } from 'src/routes/safe/components/Transactions/TxList/utils'

export const getAwaitingGatewayTransactions = (
  allTransactions: TransactionSummary[],
  userAccount: string,
): TransactionSummary[] => {
  return allTransactions.filter((tx) => {
    // The transaction is not executed and is not cancelled, nor pending, so it's still waiting confirmations
    if (isStatusAwaitingConfirmation(tx.txStatus)) {
      // Then we check if the waiting confirmations are not from the current user, otherwise, filters this transaction
      return addressInList(tx.executionInfo?.missingSigners ?? undefined)(userAccount)
    }

    return false
  })
}
