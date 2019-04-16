// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import type { Owner } from '~/routes/safe/store/models/owner'
import TokenBalance from '~/routes/safe/store/models/tokenBalance'

export type SafeProps = {
  name: string,
  address: string,
  threshold: number,
  owners: List<Owner>,
  balances?: List<TokenBalance>,
  activeTokens?: List<string>,
  ethBalance?: string,
}

const SafeRecord: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: 0,
  owners: List([]),
  activeTokens: List([]),
  balances: List([]),
})

export type Safe = RecordOf<SafeProps>

export default SafeRecord
