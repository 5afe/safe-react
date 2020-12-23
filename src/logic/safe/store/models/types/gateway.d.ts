type TransferDirection = 'INCOMING' | 'OUTGOING'

type Erc20Transfer = {
  type: 'ERC20'
  tokenAddress: string
  tokenName: string | null
  tokenSymbol: string | null
  logoUri: string | null
  decimals: number | null
  value: string
}

type Erc721Transfer = {
  type: 'ERC721'
  tokenAddress: string
  tokenId: string
  tokenName: string | null
  tokenSymbol: string | null
  logoUri: string | null
}

type NativeTransfer = {
  type: 'ETHER'
  value: string
}

type TransferInfo = Erc20Transfer | Erc721Transfer | NativeTransfer

export type Transfer = {
  type: 'Transfer'
  sender: string
  recipient: string
  direction?: TransferDirection
  transferInfo: TransferInfo // Polymorphic: Erc20, Erc721, Ether
}

enum Operation {
  CALL,
  DELEGATE,
}

type InternalTransaction = {
  operation: Operation
  to: string
  value: number | null
  data: string | null
  dataDecoded: DataDecoded | null
}

type Parameter = {
  name: string
  type: string
  value: string
  valueDecoded: InternalTransaction[] | null
}

type DataDecoded = {
  method: string
  parameters: Parameter[] | null
}

type SetFallbackHandler = {
  type: 'SET_FALLBACK_HANDLER'
  handler: string
}

type AddOwner = {
  type: 'ADD_OWNER'
  owner: string
  threshold: number
}

type RemoveOwner = {
  type: 'REMOVE_OWNER'
  owner: string
  threshold: number
}

type SwapOwner = {
  type: 'SWAP_OWNER'
  oldOwner: string
  newOwner: string
}

type ChangeThreshold = {
  type: 'CHANGE_THRESHOLD'
  threshold: number
}

type ChangeImplementation = {
  type: 'CHANGE_IMPLEMENTATION'
  implementation: string
}

type EnableModule = {
  type: 'ENABLE_MODULE'
  module: string
}

type DisableModule = {
  type: 'DISABLE_MODULE'
  module: string
}

type SettingsInfo =
  | SetFallbackHandler
  | AddOwner
  | RemoveOwner
  | SwapOwner
  | ChangeThreshold
  | ChangeImplementation
  | EnableModule
  | DisableModule

type SettingsChange = {
  type: 'SettingsChange'
  dataDecoded: DataDecoded
  settingsInfo: SettingsInfo | null
}

type Custom = {
  type: 'Custom'
  to: string
  dataSize: string
  value: string
  methodName: string | null
}

type Creation = {
  type: 'Creation'
  creator: string
  transactionHash: string
  masterCopy: string | null
  factory: string | null
}

type TransactionStatus = 'AWAITING_CONFIRMATIONS' | 'AWAITING_EXECUTION' | 'CANCELLED' | 'FAILED' | 'SUCCESS'

type TransactionInfo = Transfer | SettingsChange | Custom | Creation

type ExecutionInfo = {
  nonce: number
  confirmationsRequired: number
  confirmationsSubmitted: number
}

export type TransactionSummary = {
  id: string
  timestamp: number
  txStatus: TransactionStatus
  txInfo: TransactionInfo // Polymorphic: Transfer, SettingsChange, Custom, Creation
  executionInfo: ExecutionInfo | null
}

type TransactionData = {
  hexData: string | null
  dataDecoded: DataDecoded | null
  to: string
  value: string | null
  operation: Operation
}

type ModuleExecutionDetails = {
  address: string
}

type MultiSigConfirmations = {
  signer: string
  signature: string | null
}

type TokenType = 'ERC721' | 'ERC20' | 'ETHER'

type TokenInfo = {
  tokenType: TokenType
  address: string
  decimals: number
  symbol: string
  name: string
  logoUri: string | null
}

type MultiSigExecutionDetails = {
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

type ExpandedTxDetails = {
  executedAt: number
  txStatus: TransactionStatus
  txInfo: TransactionInfo
  txData: TransactionData | null
  detailedExecutionInfo: DetailedExecutionInfo | null
  txHash: string | null
}

type Transaction = TransactionSummary & {
  txDetails?: ExpandedTxDetails
}

type StoreStructure = {
  queued: {
    next: { [nonce: number]: Transaction[] } // 1 Transaction element
    queued: { [nonce: number]: Transaction[] } // n Transaction elements
  }
  history: { [timestamp: number]: Transaction[] } // n Transaction elements
}

type Label = {
  type: 'LABEL'
  label: 'Next' | 'Queued'
}

type DateLabel = {
  type: 'DATE_LABEL'
  timestamp: number
}

type ConflictHeader = {
  type: 'CONFLICT_HEADER'
  nonce: number
}

type TransactionGatewayResult = {
  type: 'TRANSACTION'
  transaction: TransactionSummary
  conflictType: 'HasNext' | 'End' | 'None'
}

type GatewayResponse = {
  next: string | null
  previous: string | null
}

type HistoryGatewayResult = DateLabel | TransactionGatewayResult

type HistoryGatewayResponse = GatewayResponse & {
  results: HistoryGatewayResult[]
}

type QueuedGatewayResult = Label | ConflictHeader | TransactionGatewayResult

type QueuedGatewayResponse = GatewayResponse & {
  results: QueuedGatewayResult[]
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

export const isTransactionSummary = (
  value: HistoryGatewayResult | QueuedGatewayResult,
): value is TransactionGatewayResult => {
  return value.type === 'TRANSACTION'
}
