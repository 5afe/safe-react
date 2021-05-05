import { List, Record, RecordOf } from 'immutable'
import { FEATURES } from 'src/config/networks/network.d'
import { BalanceRecord } from 'src/logic/tokens/store/actions/fetchSafeTokens'

export type SafeOwner = {
  name: string
  address: string
}

export type ModulePair = [
  // previous module
  string,
  // module
  string,
]

export type SpendingLimit = {
  delegate: string
  token: string
  amount: string
  spent: string
  resetTimeMin: string
  lastResetMin: string
  nonce: string
}

export type SafeRecordProps = {
  name: string
  address: string
  threshold: number
  ethBalance: string
  totalFiatBalance: string
  owners: List<SafeOwner>
  modules?: ModulePair[] | null
  spendingLimits?: SpendingLimit[] | null
  balances: BalanceRecord[]
  nonce: number
  recurringUser?: boolean
  loadedViaUrl?: boolean
  currentVersion: string
  needsUpdate: boolean
  featuresEnabled: Array<FEATURES>
}

const makeSafe = Record<SafeRecordProps>({
  name: '',
  address: '',
  threshold: 0,
  ethBalance: '0',
  totalFiatBalance: '0',
  owners: List([]),
  modules: [],
  spendingLimits: [],
  balances: [],
  nonce: 0,
  loadedViaUrl: false,
  recurringUser: undefined,
  currentVersion: '',
  needsUpdate: false,
  featuresEnabled: [],
})

export type SafeRecord = RecordOf<SafeRecordProps>

export default makeSafe
