// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'

export type TransactionStatus = 'awaiting_confirmations' | 'success' | 'cancelled' | 'awaiting_execution' | 'pending'

export type TransactionProps = {
  nonce: number,
  value: string,
  confirmations: List<Confirmation>,
  recipient: string,
  data: string,
  isExecuted: boolean,
  submissionDate: string,
  executionDate: string,
  symbol: string,
  modifySettingsTx: boolean,
  cancellationTx: boolean,
  customTx: boolean,
  safeTxHash: string,
  executionTxHash?: string,
  decimals?: number,
  cancelled?: boolean,
  status?: TransactionStatus,
  isTokenTransfer: boolean,
  decodedParams?: Object,
}

export const makeTransaction: RecordFactory<TransactionProps> = Record({
  nonce: 0,
  value: 0,
  confirmations: List([]),
  recipient: '',
  data: '',
  isExecuted: false,
  submissionDate: '',
  executionDate: '',
  symbol: '',
  executionTxHash: undefined,
  safeTxHash: '',
  cancelled: false,
  modifySettingsTx: false,
  cancellationTx: false,
  customTx: false,
  status: 'awaiting',
  decimals: 18,
  isTokenTransfer: false,
  decodedParams: {},
})

export type Transaction = RecordOf<TransactionProps>
