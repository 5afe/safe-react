import {
  EthereumTransaction,
  ModuleTransaction,
  MultiSendMethodParameter,
  MultiSigTransaction,
  Parameter,
  Transaction,
  TxType,
} from 'src/routes/safe/store/models/types/transactions.d'

export const isMultiSigTx = (tx: Transaction): tx is MultiSigTransaction => {
  return TxType[tx.txType] === TxType.MULTISIG_TRANSACTION
}

export const isModuleTx = (tx: Transaction): tx is ModuleTransaction => {
  return TxType[tx.txType] === TxType.MODULE_TRANSACTION
}

export const isEthereumTx = (tx: Transaction): tx is EthereumTransaction => {
  return TxType[tx.txType] === TxType.ETHEREUM_TRANSACTION
}

export const isMultiSendParameter = (parameter: Parameter): parameter is MultiSendMethodParameter => {
  return !!(parameter as MultiSendMethodParameter)?.valueDecoded
}
