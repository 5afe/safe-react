import { List, Map, Record, RecordOf, Set } from 'immutable'
import { FEATURES } from 'src/config/networks/network.d'

export type SafeOwner = {
  name: string
  address: string
}

export type ModulePair = [string, string]

export type SafeRecordProps = {
  name: string
  address: string
  threshold: number
  ethBalance: string
  owners: List<SafeOwner>
  modules?: ModulePair[] | null
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
  featuresEnabled: Array<FEATURES>
}

const makeSafe = Record<SafeRecordProps>({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: '0',
  owners: List([]),
  modules: [],
  activeTokens: Set(),
  activeAssets: Set(),
  blacklistedTokens: Set(),
  blacklistedAssets: Set(),
  balances: Map(),
  nonce: 0,
  latestIncomingTxBlock: 0,
  recurringUser: undefined,
  currentVersion: '',
  needsUpdate: false,
  featuresEnabled: [],
})

export type SafeRecord = RecordOf<SafeRecordProps>

export default makeSafe
