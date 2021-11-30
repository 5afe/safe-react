import { Record, RecordOf } from 'immutable'

import { ChainId, CHAIN_ID } from 'src/config/chain.d'

export type ProviderProps = {
  name: string
  loaded: boolean
  available: boolean
  account: string
  network: ChainId
  smartContractWallet: boolean
  hardwareWallet: boolean
}

export const makeProvider = Record<ProviderProps>({
  name: '',
  loaded: false,
  available: false,
  account: '',
  network: CHAIN_ID.UNKNOWN,
  smartContractWallet: false,
  hardwareWallet: false,
})

// Usage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })

export type ProviderRecord = RecordOf<ProviderProps>
