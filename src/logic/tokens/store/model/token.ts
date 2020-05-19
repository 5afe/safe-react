import { Record } from 'immutable'

export const makeToken = Record({
  address: '',
  name: '',
  symbol: '',
  decimals: 0,
  logoUri: '',
  balance: undefined,
})

// balance is only set in extendedSafeTokensSelector when we display user's token balances
