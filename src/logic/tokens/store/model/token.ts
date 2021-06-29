import { Record, RecordOf } from 'immutable'
import { TokenType } from 'src/logic/safe/store/models/types/gateway'
import { BalanceRecord } from 'src/logic/tokens/store/actions/fetchSafeTokens'

export type TokenProps = {
  address: string
  name: string
  symbol: string
  decimals: number | string
  logoUri: string
  balance: BalanceRecord
  type?: TokenType
}

export const makeToken = Record<TokenProps>({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUri: '',
  balance: {
    fiatBalance: '0',
    tokenBalance: '0',
  },
})
// balance is only set in extendedSafeTokensSelector when we display user's token balances

export type Token = RecordOf<TokenProps>
