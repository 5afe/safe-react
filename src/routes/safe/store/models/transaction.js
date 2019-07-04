// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'

export type TransactionProps = {
  name: string,
  nonce: number,
  value: number,
  confirmations: List<Confirmation>,
  recipient: string,
  data: string,
  isExecuted: boolean,
  submissionDate: Date,
  executionDate: Date,
  symbol: string,
  creationTxHash: string,
  executionTxHash?: string,
  cancelled?: boolean,
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
  creationTxHash: '',
  cancelled: false,
})

export type Transaction = RecordOf<TransactionProps>
