import { createAction } from 'redux-actions'

export const SET_CURRENCY_BALANCES = 'SET_CURRENCY_BALANCES'

// eslint-disable-next-line max-len
export const setCurrencyBalances = createAction(SET_CURRENCY_BALANCES, (safeAddress, currencyBalances) => ({
  safeAddress,
  currencyBalances,
}))
