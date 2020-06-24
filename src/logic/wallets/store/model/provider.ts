import { Record, RecordOf } from 'immutable'

export type ProviderProps = {
  name: string
  loaded: boolean
  available: boolean
  account: string
  network: number
  smartContractWallet: boolean
  hardwareWallet: boolean
}

export const makeProvider = Record<ProviderProps>({
  name: '',
  loaded: false,
  available: false,
  account: '',
  network: 0,
  smartContractWallet: false,
  hardwareWallet: false,
})

// Usage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })

export type ProviderRecord = RecordOf<ProviderProps>
