// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'

export const OUTGOING_TX_TYPE = 'outgoing'

export type TransactionType = 'incoming' | 'outgoing' | 'settings' | 'custom' | 'creation' | 'cancellation'

export type TransactionStatus =
  | 'awaiting_your_confirmation'
  | 'awaiting_confirmations'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'awaiting_execution'
  | 'pending'

export type TransactionProps = {
  nonce: ?number,
  blockNumber: ?number,
  value: string,
  confirmations: List<Confirmation>,
  recipient: string,
  data?: string,
  operation: number,
  safeTxGas: number,
  baseGas: number,
  gasPrice: number,
  gasToken: string,
  refundReceiver: string,
  isExecuted: boolean,
  isSuccessful: boolean,
  submissionDate: ?string,
  executionDate: ?string,
  symbol: string,
  modifySettingsTx: boolean,
  cancellationTx: boolean,
  customTx: boolean,
  creationTx: boolean,
  multiSendTx: boolean,
  upgradeTx: boolean,
  safeTxHash: string,
  executor: string,
  executionTxHash?: ?string,
  decimals?: number,
  cancelled?: boolean,
  status?: TransactionStatus,
  isTokenTransfer: boolean,
  decodedParams?: Object,
  refundParams?: Object,
  type: string,
  origin: string | null,
}

export const makeTransaction: RecordFactory<TransactionProps> = Record({
  nonce: 0,
  blockNumber: 0,
  value: 0,
  confirmations: List([]),
  recipient: '',
  data: null,
  operation: 0,
  safeTxGas: 0,
  baseGas: 0,
  gasPrice: 0,
  gasToken: ZERO_ADDRESS,
  refundReceiver: ZERO_ADDRESS,
  isExecuted: false,
  isSuccessful: true,
  submissionDate: '',
  executor: '',
  executionDate: '',
  symbol: '',
  executionTxHash: undefined,
  safeTxHash: '',
  cancelled: false,
  modifySettingsTx: false,
  cancellationTx: false,
  customTx: false,
  creationTx: false,
  multiSendTx: false,
  upgradeTx: false,
  status: 'awaiting',
  decimals: 18,
  isTokenTransfer: false,
  decodedParams: {},
  refundParams: null,
  type: 'outgoing',
  origin: null,
})

export type Transaction = RecordOf<TransactionProps>
