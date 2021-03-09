import { Record, RecordOf } from 'immutable'
import { TokenType } from 'src/logic/safe/store/models/types/gateway'

export type TokenProps = {
  address: string
  name: string
  symbol: string
  decimals: number | string
  logoUri: string
  balance: number | string
  type?: TokenType
}

export const makeToken = Record<TokenProps>({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUri: '',
  balance: 0,
})
// balance is only set in extendedSafeTokensSelector when we display user's token balances

export type Token = RecordOf<TokenProps>
