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
  activeAssets: Set<string>,
  blacklistedTokens: Set<string>,
  blacklistedAssets: Set<string>,
  ethBalance?: string,
  nonce: number,
  latestIncomingTxBlock?: number,
  recurringUser?: boolean,
  currentVersion: string,
  needsUpdate: boolean,
  featuresEnabled: string[],
}

const SafeRecord: RecordFactory<SafeProps> = Record({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: 0,
  owners: List([]),
  activeTokens: new Set(),
  activeAssets: new Set(),
  blacklistedTokens: new Set(),
  blacklistedAssets: new Set(),
  balances: Map({}),
  nonce: 0,
  latestIncomingTxBlock: 0,
  recurringUser: undefined,
  currentVersion: '',
  needsUpdate: false,
  featuresEnabled: [],
})

export type Safe = RecordOf<SafeProps>

export default SafeRecord
