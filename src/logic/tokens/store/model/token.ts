import { Record, RecordOf } from 'immutable'

export type TokenProps = {
  address: string
  name: string
  symbol: string
  decimals: number | string
  logoUri: string
  balance?: number | string
}

export const makeToken = Record<TokenProps>({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUri: '',
  balance: undefined,
})
// balance is only set in extendedSafeTokensSelector when we display user's token balances

export type Token = RecordOf<TokenProps>
