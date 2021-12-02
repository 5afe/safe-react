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
} from '@gnosis.pm/safe-react-gateway-sdk'

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

export const isStatusSuccess = (value: TransactionStatus): value is 'SUCCESS' => {
  return value === 'SUCCESS'
}

export const isStatusFailed = (value: TransactionStatus): value is 'FAILED' => {
  return value === 'FAILED'
}

export const isStatusCancelled = (value: TransactionStatus): value is 'CANCELLED' => {
  return value === 'CANCELLED'
}

export const isStatusPending = (value: TransactionStatus): value is 'PENDING' => {
  return value === 'PENDING'
}

export const isStatusPendingFailed = (value: TransactionStatus): value is 'PENDING_FAILED' => {
  return value === 'PENDING_FAILED'
}

export const isStatusAwaitingConfirmation = (value: TransactionStatus): value is 'AWAITING_CONFIRMATIONS' => {
  return value === 'AWAITING_CONFIRMATIONS'
}

export const isStatusAwaitingExecution = (value: TransactionStatus): value is 'AWAITING_EXECUTION' => {
  return value === 'AWAITING_EXECUTION'
}

export const isStatusWillBeReplaced = (value: TransactionStatus): value is 'WILL_BE_REPLACED' => {
  return value === 'WILL_BE_REPLACED'
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

export const isTxPending = (value: TransactionStatus): value is 'PENDING' | 'PENDING_FAILED' => {
  return ['PENDING', 'PENDING_FAILED'].includes(value)
}

export const isTxQueued = (
  value: TransactionStatus,
): value is 'PENDING' | 'PENDING_FAILED' | 'AWAITING_CONFIRMATIONS' | 'AWAITING_EXECUTION' | 'WILL_BE_REPLACED' => {
  return ['PENDING', 'PENDING_FAILED', 'AWAITING_CONFIRMATIONS', 'AWAITING_EXECUTION', 'WILL_BE_REPLACED'].includes(
    value,
  )
}
