import { createAction } from 'redux-actions'
import { Currency } from '../model/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

// eslint-disable-next-line max-len
export const setSelectedCurrency = createAction(
  SET_CURRENT_CURRENCY,
  (safeAddress: string, selectedCurrency: Currency) => ({
    safeAddress,
    selectedCurrency,
  }),
)
