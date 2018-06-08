// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { type DailyLimit, makeDailyLimit } from '~/routes/safe/store/model/dailyLimit'
import type { Owner } from '~/routes/safe/store/model/owner'

export type SafeProps = {
  name: string,
  address: string,
  threshold: number,
  owners: List<Owner>,
  dailyLimit: DailyLimit,
}

export const makeSafe: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  owners: List([]),
  dailyLimit: makeDailyLimit(),
})

export type Safe = RecordOf<SafeProps>

// Useage const someRecord: Safe = makeSafe({ name: ... })
