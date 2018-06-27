// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type BalanceProps = {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoUrl: string,
  funds: string,
}

export const makeBalance: RecordFactory<BalanceProps> = Record({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUrl: '',
  funds: '0',
})

export type Balance = RecordOf<BalanceProps>
