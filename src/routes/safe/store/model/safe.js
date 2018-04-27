// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import type { Owner } from '~/routes/safe/store/model/owner'

export type SafeProps = {
  name: string,
  address: string,
  confirmations: number,
  owners: List<Owner>,
  dailyLimit: number,
}

export const makeSafe: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  confirmations: 0,
  owners: List([]),
  dailyLimit: 0,
})

export type Safe = RecordOf<SafeProps>

// Useage const someRecord: Safe = makeSafe({ name: ... })
