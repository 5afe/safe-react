import { Record, RecordOf } from 'immutable'

import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

export type ProviderProps = {
  name: string
  loaded: boolean
  available: boolean
  account: string
  network: ETHEREUM_NETWORK
  smartContractWallet: boolean
  hardwareWallet: boolean
}

export const makeProvider = Record<ProviderProps>({
  name: '',
  loaded: false,
  available: false,
  account: '',
  network: ETHEREUM_NETWORK.UNKNOWN,
  smartContractWallet: false,
  hardwareWallet: false,
})

// Usage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })

export type ProviderRecord = RecordOf<ProviderProps>
