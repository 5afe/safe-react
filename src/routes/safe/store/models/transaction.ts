import { List, Map, Record } from 'immutable'

import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

export type TransactionType =
  | 'incoming'
  | 'outgoing'
  | 'settings'
  | 'custom'
  | 'creation'
  | 'cancellation'
  | 'upgrade'
  | 'token'
  | 'collectible'

export type TransactionStatus =
  | 'awaiting_your_confirmation'
  | 'awaiting_confirmations'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'awaiting_execution'
  | 'pending'

export type PendingActionType = 'Confirm' | 'Reject'

export type TransactionProps = {
  baseGas: number
  blockNumber?: number | null
  cancelled?: boolean
  confirmations: List<any>
  creationTx: boolean
  customTx: boolean
  data?: string | null
  decimals?: (number | string) | null
  decodedParams: any
  executionDate?: string | null
  executionTxHash?: string | null
  executor: string
  gasPrice: number
  gasToken: string
  isCancellationTx: boolean
  isCollectibleTransfer: boolean
  isExecuted: boolean
  isPending?: boolean
  isSuccessful: boolean
  isTokenTransfer: boolean
  modifySettingsTx: boolean
  multiSendTx: boolean
  nonce?: number | null
  operation: number
  origin: string | null
  ownersWithPendingActions: Map<PendingActionType, List<any>>
  recipient: string
  refundParams: any
  refundReceiver: string
  safeTxGas: number
  safeTxHash: string
  status?: TransactionStatus
  submissionDate?: string | null
  symbol?: string | null
  type: TransactionType
  upgradeTx: boolean
  value: string
}

export const makeTransaction = Record({
  baseGas: 0,
  blockNumber: 0,
  cancelled: false,
  confirmations: List([]),
  creationTx: false,
  customTx: false,
  data: null,
  decimals: 18,
  decodedParams: {},
  executionDate: '',
  executionTxHash: undefined,
  executor: '',
  gasPrice: 0,
  gasToken: ZERO_ADDRESS,
  isCancellationTx: false,
  isCollectibleTransfer: false,
  isExecuted: false,
  isSuccessful: true,
  isTokenTransfer: false,
  modifySettingsTx: false,
  multiSendTx: false,
  nonce: 0,
  operation: 0,
  origin: null,
  ownersWithPendingActions: Map({ confirm: List([]), reject: List([]) }),
  recipient: '',
  refundParams: null,
  refundReceiver: ZERO_ADDRESS,
  safeTxGas: 0,
  safeTxHash: '',
  status: 'awaiting',
  submissionDate: '',
  symbol: '',
  type: 'outgoing',
  upgradeTx: false,
  value: 0,
})

export type Transaction = Record<TransactionProps>
