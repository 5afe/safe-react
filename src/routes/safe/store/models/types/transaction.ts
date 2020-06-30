import { List, Map, RecordOf } from 'immutable'
import { DecodedMethods } from 'src/logic/contracts/methodIds'
import { Confirmation } from './confirmation'

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
  confirmations: List<Confirmation>
  created: boolean
  creator: string
  creationTx: boolean
  customTx: boolean
  data?: string | null
  decimals?: (number | string) | null
  decodedParams: DecodedMethods
  executionDate?: string | null
  executionTxHash?: string | null
  executor: string
  factoryAddress: string
  gasPrice: string
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
  ownersWithPendingActions: Map<PendingActionValues, List<any>>
  recipient: string
  refundParams: any
  refundReceiver: string
  safeTxGas: number
  safeTxHash: string
  setupData: string
  status?: TransactionStatus
  submissionDate?: string | null
  symbol?: string | null
  transactionHash: string | null
  type: TransactionTypes
  upgradeTx: boolean
  value: string
}

export type Transaction = RecordOf<TransactionProps>

export type TxArgs = {
  baseGas: number
  data?: string | null
  gasPrice: string
  gasToken: string
  nonce: number
  operation: number
  refundReceiver: string
  safeInstance: any
  safeTxGas: number
  sender?: string
  sigs: string
  to: string
  valueInWei: number | string
}
