// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type TokenProps = {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoUri: string,
  funds: string,
  status: boolean,
  removable: boolean,
}

export const makeToken: RecordFactory<TokenProps> = Record({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUri: '',
  funds: '0',
  status: true,
  removable: false,
})

export type Token = RecordOf<TokenProps>
