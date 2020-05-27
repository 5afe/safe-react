export enum TransactionTypes {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
  SETTINGS = 'settings',
  CUSTOM = 'custom',
  CREATION = 'creation',
  CANCELLATION = 'cancellation',
  UPGRADE = 'upgrade',
  TOKEN = 'token',
  COLLECTIBLE = 'collectible',
}
export type TransactionTypeValues = typeof TransactionTypes[keyof typeof TransactionTypes]

export enum TransactionStatus {
  AWAITING_YOUR_CONFIRMATION = 'awaiting_your_confirmation',
  AWAITING_CONFIRMATIONS = 'awaiting_confirmations',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  AWAITING_EXECUTION = 'awaiting_execution',
  PENDING = 'pending',
}
export type TransactionStatusValues = typeof TransactionStatus[keyof typeof TransactionStatus]

export enum PendingActionType {
  CONFIRM = 'confirm',
  REJECT = 'reject',
}
export type PendingActionValues = PendingActionType[keyof PendingActionType]

export type TransactionProps = {
  baseGas: number
  blockNumber?: number | null
  cancelled?: boolean
  confirmations: import('immutable').List<any>
  created: boolean
  creator: string
  creationTx: boolean
  customTx: boolean
  data?: string | null
  decimals?: (number | string) | null
  decodedParams: import('src/logic/contracts/methodIds').DecodedMethods
  executionDate?: string | null
  executionTxHash?: string | null
  executor: string
  factoryAddress: string
  gasPrice: number
  gasToken: string
  isCancellationTx: boolean
  isCollectibleTransfer: boolean
  isExecuted: boolean
  isPending?: boolean
  isSuccessful: boolean
  isTokenTransfer: boolean
  masterCopy: string
  modifySettingsTx: boolean
  multiSendTx: boolean
  nonce?: number | null
  operation: number
  origin: string | null
  ownersWithPendingActions: import('immutable').Map<PendingActionValues, import('immutable').List<any>>
  recipient: string
  refundParams: any
  refundReceiver: string
  safeTxGas: number
  safeTxHash: string
  setupData: string
  status?: TransactionStatus
  submissionDate?: string | null
  symbol?: string | null
  transactionHash: string
  type: TransactionTypes
  upgradeTx: boolean
  value: string
}

export type Transaction = import('immutable').RecordOf<TransactionProps>

export type TxArgs = {
  data: any
  baseGas: number
  gasToken: string
  safeInstance: any
  nonce: number
  valueInWei: any
  safeTxGas: number
  refundReceiver: string
  sender: any
  sigs: string
  to: any
  operation: any
  gasPrice: number
}
