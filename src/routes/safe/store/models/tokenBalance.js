// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type TokenBalanceProps = {
  address: string,
  balance: string,
}

const TokenBalanceRecord: RecordFactory<TokenBalanceProps> = Record({
  address: '',
  balance: '0',
})

export type TokenBalance = RecordOf<TokenBalanceProps>

export default TokenBalanceRecord
