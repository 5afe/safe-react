// @flow
import { List, Record, Map } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import type { Owner } from '~/routes/safe/store/model/owner'

export type SafeProps = {
  name: string,
  address: string,
  threshold: number,
  owners: List<Owner>,
  activeTokensBalances: Map<String, String>,
}

const SafeRecord: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  owners: List([]),
  activeTokensBalances: Map([]),
})

export type Safe = RecordOf<SafeProps>

export default SafeRecord
