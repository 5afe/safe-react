import { List, Map, Record, Set } from 'immutable'

const SafeRecord = Record({
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

export default SafeRecord
