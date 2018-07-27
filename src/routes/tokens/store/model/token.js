// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type TokenProps = {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoUrl: string,
  funds: string,
  status: boolean,
  removable: boolean,
}

export const makeToken: RecordFactory<TokenProps> = Record({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUrl: '',
  funds: '0',
  status: true,
  removable: false,
})

export type Token = RecordOf<TokenProps>
