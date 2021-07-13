import { GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk'
import {
  DataDecoded,
  Custom,
  TransactionSummary,
  Label,
  DateLabel,
  ConflictHeader,
  Transfer,
  TransactionStatus as GWTransactionStatus,
} from 'src/types/gateway/transactions'

export enum Operation {
  CALL = 0,
  DELEGATE = 1,
}

type SafeAppInfo = GatewayDefinitions['SafeAppInfo']

type TransactionData = {
  hexData: string | null
  dataDecoded: DataDecoded | null
  to: string
  value: string | null
  operation: Operation
}

type ModuleExecutionDetails = {
  type: 'MODULE'
  address: string
}

type MultiSigConfirmations = {
  signer: string
  signature: string | null
}

type TokenInfo = GatewayDefinitions['TokenInfo']

export type TokenType = TokenInfo['type']

export type Transaction = TransactionSummary & {
  txDetails?: ExpandedTxDetails
}

type MultiSigExecutionDetails = {
  type: 'MULTISIG'
  submittedAt: number
  nonce: number
  safeTxGas: number
  baseGas: number
  gasPrice: string
  gasToken: string
  refundReceiver: string
  safeTxHash: string
  executor: string | null
  signers: string[]
  confirmationsRequired: number
  confirmations: MultiSigConfirmations[]
  gasTokenInfo: TokenInfo | null
}

type DetailedExecutionInfo = ModuleExecutionDetails | MultiSigExecutionDetails

export type TransactionStatus = GWTransactionStatus

export type ExpandedTxDetails = {
  executedAt: number | null
  txStatus: TransactionStatus
  txInfo: TransactionInfo
  txData: TransactionData | null
  detailedExecutionInfo: DetailedExecutionInfo | null
  txHash: string | null
}

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

type HistoryGatewayResult = GatewayDefinitions['TransactionListItem']

type HistoryGatewayResponse = GatewayDefinitions['TransactionListPage']

type QueuedGatewayResult = GatewayDefinitions['TransactionListItem']

type QueuedGatewayResponse = GatewayDefinitions['TransactionListPage']

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

export const isTransactionSummary = (value: HistoryGatewayResult | QueuedGatewayResult): value is Transaction => {
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

export const isStatusSuccess = (value: Transaction['txStatus']): value is 'SUCCESS' => {
  return value === 'SUCCESS'
}

export const isStatusFailed = (value: Transaction['txStatus']): value is 'FAILED' => {
  return value === 'FAILED'
}

export const isStatusCancelled = (value: Transaction['txStatus']): value is 'CANCELLED' => {
  return value === 'CANCELLED'
}

export const isStatusPending = (value: Transaction['txStatus']): value is 'PENDING' => {
  return value === 'PENDING'
}

export const isStatusAwaitingConfirmation = (value: Transaction['txStatus']): value is 'AWAITING_CONFIRMATIONS' => {
  return value === 'AWAITING_CONFIRMATIONS'
}

export const isStatusWillBeReplaced = (value: Transaction['txStatus']): value is 'WILL_BE_REPLACED' => {
  return value === 'WILL_BE_REPLACED'
}

export const isMultiSigExecutionDetails = (
  value: ExpandedTxDetails['detailedExecutionInfo'],
): value is MultiSigExecutionDetails => {
  return value?.type === 'MULTISIG'
}

export const isModuleExecutionDetails = (
  value: ExpandedTxDetails['detailedExecutionInfo'],
): value is ModuleExecutionDetails => {
  return value?.type === 'MODULE'
}
