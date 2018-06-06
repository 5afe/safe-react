// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type DailyLimitProps = {
  value: number,
  spentToday: number,
}

export const makeDailyLimit: RecordFactory<DailyLimitProps> = Record({
  value: 0,
  spentToday: 0,
})

export type DailyLimit = RecordOf<DailyLimitProps>
