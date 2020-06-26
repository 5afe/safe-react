import { List, Map, Record, RecordOf, Set } from 'immutable'

export type SafeRecordProps = {
  name: string
  address: string
  threshold: number
  ethBalance: number | string
  owners: List<{ name: string; address: string }>
  modules: Set<string>
  activeTokens: Set<string>
  activeAssets: Set<string>
  blacklistedTokens: Set<string>
  blacklistedAssets: Set<string>
  balances: Map<string, string>
  nonce: number
  latestIncomingTxBlock: number
  recurringUser?: boolean
  currentVersion: string
  needsUpdate: boolean
  featuresEnabled: Array<string>
}

const makeSafe = Record<SafeRecordProps>({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: 0,
  owners: List([]),
  modules: Set(),
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

export type SafeRecord = RecordOf<SafeRecordProps>

export default makeSafe
