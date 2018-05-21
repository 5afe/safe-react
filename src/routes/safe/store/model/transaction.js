// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'

export type TransactionProps = {
  name: string,
  nonce: number,
  value: number,
  threshold: number,
  confirmations: List<Confirmation>,
  destination: string,
  tx: string,
}

export const makeTransaction: RecordFactory<TransactionProps> = Record({
  name: '',
  nonce: 0,
  value: 0,
  confirmations: List([]),
  destination: '',
  tx: '',
  threshold: 0,
})

export type Transaction = RecordOf<TransactionProps>
