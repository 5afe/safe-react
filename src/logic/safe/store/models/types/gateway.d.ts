import {
  ConflictHeader,
  Custom,
  DateLabel,
  Label,
  ModuleExecutionDetails,
  MultiSend,
  MultisigExecutionDetails,
  MultisigExecutionInfo,
  TransactionSummary,
  Transfer,
  TransactionDetails as GWTransactionDetails,
  Transaction as GWTransaction,
  TransactionListItem,
  TransactionListPage,
  TransactionStatus,
  TransactionInfo,
  SettingsChange,
} from '@gnosis.pm/safe-react-gateway-sdk'

/**
 * We can't use the enum values from the SDK directly when comparing to strings
 * Not sure if a bug or a feature 🤷
 */
export const LocalTransactionStatus: Record<string, TransactionStatus> = {
  AWAITING_CONFIRMATIONS: 'AWAITING_CONFIRMATIONS',
  AWAITING_EXECUTION: 'AWAITING_EXECUTION',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  WILL_BE_REPLACED: 'WILL_BE_REPLACED',
}

export type Transaction = TransactionSummary & {
  txDetails?: ExpandedTxDetails
}

export type ExpandedTxDetails = GWTransactionDetails

type StoreStructure = {
  queued: {
    next: { [nonce: number]: Transaction[] } // 1 Transaction element
    queued: { [nonce: number]: Transaction[] } // n Transaction elements
  }
  history: { [timestamp: number]: Transaction[] } // n Transaction elements
}

type TxQueuedLocation = 'queued.next' | 'queued.queued'

type TxHistoryLocation = 'history'

export type TxLocation = TxHistoryLocation | TxQueuedLocation

type HistoryGatewayResult = TransactionListItem

type HistoryGatewayResponse = TransactionListPage

type QueuedGatewayResult = TransactionListItem

type QueuedGatewayResponse = TransactionListPage

export type TransactionDetails = {
  count: number
  transactions: Array<[nonce: string, transactions: Transaction[]]>
}

/**
 * Helper functions
 */

export const isDateLabel = (value: HistoryGatewayResult): value is DateLabel => {
  return value.type === 'DATE_LABEL'
}

export const isLabel = (value: QueuedGatewayResult): value is Label => {
  return value.type === 'LABEL'
}

export const isConflictHeader = (value: QueuedGatewayResult): value is ConflictHeader => {
  return value.type === 'CONFLICT_HEADER'
}

export const isTransactionSummary = (value: HistoryGatewayResult | QueuedGatewayResult): value is GWTransaction => {
  return value.type === 'TRANSACTION'
}

export const isTransferTxInfo = (value: TransactionInfo): value is Transfer => {
  return value.type === 'Transfer'
}

export const isSettingsChangeTxInfo = (value: TransactionInfo): value is SettingsChange => {
  return value.type === 'SettingsChange'
}

export const isCustomTxInfo = (value: TransactionInfo): value is Custom => {
  return value.type === 'Custom'
}

export const isMultiSendTxInfo = (value: TransactionInfo): value is MultiSend => {
  return isCustomTxInfo(value) && value.methodName === 'multiSend'
}

export const isCreationTxInfo = (value: TransactionInfo): value is Creation => {
  return value.type === 'Creation'
}

export const isMultiSigExecutionDetails = (
  value: ExpandedTxDetails['detailedExecutionInfo'],
): value is MultisigExecutionDetails => {
  return value?.type === 'MULTISIG'
}

export const isModuleExecutionInfo = (
  value: ExpandedTxDetails['detailedExecutionInfo'],
): value is ModuleExecutionDetails => {
  return value?.type === 'MODULE'
}

export const isMultisigExecutionInfo = (value: TransactionSummary['executionInfo']): value is MultisigExecutionInfo => {
  return value?.type === 'MULTISIG'
}

export const isTxQueued = (value: LocalTransactionStatus): boolean => {
  return [
    LocalTransactionStatus.PENDING,
    LocalTransactionStatus.AWAITING_CONFIRMATIONS,
    LocalTransactionStatus.AWAITING_EXECUTION,
    LocalTransactionStatus.WILL_BE_REPLACED,
  ].includes(value)
}
