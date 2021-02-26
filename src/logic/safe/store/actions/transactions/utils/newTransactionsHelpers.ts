import { Transaction, TxType } from 'src/logic/safe/store/models/types/transactions.d'

export const isMultiSigTx = (tx: Transaction): boolean => {
  return TxType[tx.txType] === TxType.MULTISIG_TRANSACTION
}
export const isModuleTx = (tx: Transaction): boolean => {
  return TxType[tx.txType] === TxType.MODULE_TRANSACTION
}
export const isEthereumTx = (tx: Transaction): boolean => {
  return TxType[tx.txType] === TxType.ETHEREUM_TRANSACTION
}
