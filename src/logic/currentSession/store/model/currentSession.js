// @flow
import { Record, type RecordFactory, type RecordOf } from 'immutable'

export type CurrentSessionProps = {
  viewedSafes: Array<string>,
}

export const makeCurrentSession: RecordFactory<CurrentSessionProps> = Record({
  viewedSafes: [],
})

export type CurrentSession = RecordOf<CurrentSessionProps>
