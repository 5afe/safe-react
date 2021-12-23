import { TransactionSummary } from '@gnosis.pm/safe-react-gateway-sdk'

import { isMultisigExecutionInfo, LocalTransactionStatus } from 'src/logic/safe/store/models/types/gateway.d'
import { addressInList } from 'src/routes/safe/components/Transactions/TxList/utils'

export const getAwaitingGatewayTransactions = (
  allTransactions: TransactionSummary[],
  userAccount: string,
): TransactionSummary[] => {
  return allTransactions.filter((tx) => {
    // The transaction is not executed and is not cancelled, nor pending, so it's still waiting confirmations
    if (tx.txStatus === LocalTransactionStatus.AWAITING_CONFIRMATIONS && isMultisigExecutionInfo(tx.executionInfo)) {
      // Then we check if the waiting confirmations are not from the current user, otherwise, filters this transaction
      return addressInList(tx.executionInfo?.missingSigners ?? undefined)(userAccount)
    }

    return false
  })
}
