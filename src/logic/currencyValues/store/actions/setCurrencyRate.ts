import { createAction } from 'redux-actions'

export const SET_CURRENCY_RATE = 'SET_CURRENCY_RATE'

export const setCurrencyRate = createAction(SET_CURRENCY_RATE, (safeAddress: string, currencyRate: number) => ({
  safeAddress,
  currencyRate,
}))
