// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type ProviderProps = {
  name: string,
  loaded: boolean,
  available: boolean,
  account: string,
  network: number,
  smartContractWallet: boolean,
}

export const makeProvider: RecordFactory<ProviderProps> = Record({
  name: '',
  loaded: false,
  available: false,
  account: '',
  network: 0,
  smartContractWallet: false,
})

export type Provider = RecordOf<ProviderProps>

// Useage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })
