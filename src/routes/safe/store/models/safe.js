// @flow
import { List, Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import type { Owner } from '~/routes/safe/store/models/owner'
import type { SafeToken } from '~/routes/safe/store/models/safeToken'

export type SafeProps = {
  name: string,
  address: string,
  threshold: number,
  ethBalance: string,
  owners: List<Owner>,
  tokens?: List<SafeToken>,
}

const SafeRecord: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: 0,
  owners: List([]),
  tokens: List([]),
})

// Tokens is a list of currently enabled tokens for the safe with balances

export type Safe = RecordOf<SafeProps>

export default SafeRecord
