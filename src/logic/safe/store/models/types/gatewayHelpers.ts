import { TransactionSummary } from 'src/logic/safe/store/models/types/gateway'
import { SafeModuleTransaction, Transaction } from 'src/logic/safe/store/models/types/transaction'

export const isGatewayTransaction = (
  tx: TransactionSummary | Transaction | SafeModuleTransaction,
): tx is TransactionSummary => {
  // @ts-expect-error .id may not be defined.
  return !!tx.id
}
