// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type ProviderProps = {
  name: string,
  loaded: boolean,
  available: boolean,
  account?: string | null,
  network: number,
}

export const makeProvider: RecordFactory<ProviderProps> = Record({
  name: '',
  loaded: false,
  available: false,
  account: null,
  network: 0,
})

export type Provider = RecordOf<ProviderProps>

// Useage const someProvider: Provider = makeProvider({ name: 'METAMASK', loaded: false, available: false })
