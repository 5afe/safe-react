// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type SafeTokenProps = {
  address: string,
  balance: string,
}

const SafeTokenRecord: RecordFactory<SafeTokenProps> = Record({
  address: '',
  balance: '0',
})

export type SafeToken = RecordOf<SafeTokenProps>

export default SafeTokenRecord
