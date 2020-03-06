// @flow
import { List, Map, Record, Set } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

import type { Owner } from '~/routes/safe/store/models/owner'

export type SafeProps = {
  name: string,
  address: string,
  threshold: number,
  owners: List<Owner>,
  balances?: Map<string, string>,
  activeTokens: Set<string>,
  blacklistedTokens: Set<string>,
  ethBalance?: string,
  nonce: number,
  latestIncomingTxBlock?: number,
  recurringUser?: boolean,
}

const SafeRecord: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: 0,
  owners: List([]),
  activeTokens: new Set(),
  blacklistedTokens: new Set(),
  balances: Map({}),
  nonce: 0,
  latestIncomingTxBlock: 0,
  recurringUser: undefined,
})

export type Safe = RecordOf<SafeProps>

export default SafeRecord
