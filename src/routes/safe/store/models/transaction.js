// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'

export type TransactionStatus = 'awaiting_confirmations' | 'success' | 'cancelled' | 'awaiting_execution'

export type TransactionProps = {
  name: string,
  nonce: number,
  value: string,
  confirmations: List<Confirmation>,
  recipient: string,
  data: string,
  isExecuted: boolean,
  submissionDate: Date,
  executionDate: Date,
  symbol: string,
  modifySettingsTx: boolean,
  cancellationTx: boolean,
  safeTxHash: string,
  executionTxHash?: string,
  cancelled?: boolean,
  status?: TransactionStatus,
  isTokenTransfer: boolean,
  decodedParams?: Object,
}

export const makeTransaction: RecordFactory<TransactionProps> = Record({
  name: '',
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
  status: 'awaiting',
  isTokenTransfer: false,
  decodedParams: {},
})

export type Transaction = RecordOf<TransactionProps>
