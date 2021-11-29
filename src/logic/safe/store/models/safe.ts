import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { Record, RecordOf } from 'immutable'
import { ChainId, SAFE_FEATURES } from 'src/config'

import { BalanceRecord } from 'src/logic/tokens/store/actions/fetchSafeTokens'

export type SafeOwner = string

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
  address: string
  chainId?: ChainId
  threshold: number
  ethBalance: string
  totalFiatBalance: string
  owners: SafeOwner[]
  modules?: ModulePair[] | null
  spendingLimits?: SpendingLimit[] | null
  balances: BalanceRecord[]
  nonce: number
  recurringUser?: boolean
  currentVersion: string
  needsUpdate: boolean
  featuresEnabled: Array<FEATURES | SAFE_FEATURES>
  loadedViaUrl: boolean
  guard: string
  collectiblesTag: string
  txQueuedTag: string
  txHistoryTag: string
}

/**
 * Create a safe record defaulting to these values
 */
const makeSafe = Record<SafeRecordProps>({
  address: '',
  chainId: undefined,
  threshold: 0,
  ethBalance: '0',
  totalFiatBalance: '0',
  owners: [],
  modules: [],
  spendingLimits: [],
  balances: [],
  nonce: 0,
  recurringUser: undefined,
  currentVersion: '',
  needsUpdate: false,
  featuresEnabled: [],
  loadedViaUrl: true,
  guard: '',
  collectiblesTag: '0',
  txQueuedTag: '0',
  txHistoryTag: '0',
})

export type SafeRecord = RecordOf<SafeRecordProps>

export default makeSafe
