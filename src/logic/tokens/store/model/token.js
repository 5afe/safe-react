// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type TokenProps = {
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoUri: string,
  balance: string,
}

export const makeToken: RecordFactory<TokenProps> = Record({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUri: '',
  balance: undefined,
})

// balance is only set in extendedSafeTokensSelector when we display user's token balances

export type Token = RecordOf<TokenProps>
