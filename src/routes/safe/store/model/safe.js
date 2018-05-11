// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import type { Owner } from '~/routes/safe/store/model/owner'

export type DailyLimitProps = {
  value: number,
  spentToday: number,
}

export const makeDailyLimit: RecordFactory<DailyLimitProps> = Record({
  value: 0,
  spentToday: 0,
})

export type DailyLimit = RecordOf<DailyLimitProps>

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
  dailyLimit: makeDailyLimit(),
})

export type Safe = RecordOf<SafeProps>

// Useage const someRecord: Safe = makeSafe({ name: ... })
