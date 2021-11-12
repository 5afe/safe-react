import { Record, RecordOf } from 'immutable'

import { ETHEREUM_NETWORK, NETWORK_ID } from 'src/config/network.d'

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
  network: NETWORK_ID.UNKNOWN as ETHEREUM_NETWORK,
  smartContractWallet: false,
  hardwareWallet: false,
})

// Usage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })

export type ProviderRecord = RecordOf<ProviderProps>
