import { List, Map, Record, Set } from 'immutable'

const SafeRecord = Record({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: 0,
  owners: List([]),
  activeTokens: Set(),
  activeAssets: Set(),
  blacklistedTokens: Set(),
  blacklistedAssets: Set(),
  balances: Map({}),
  nonce: 0,
  latestIncomingTxBlock: 0,
  recurringUser: undefined,
  currentVersion: '',
  needsUpdate: false,
  featuresEnabled: [],
})

export default SafeRecord
