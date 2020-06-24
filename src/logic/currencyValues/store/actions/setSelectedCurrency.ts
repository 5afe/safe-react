import { createAction } from 'redux-actions'
import { AVAILABLE_CURRENCIES } from '../model/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

export const setSelectedCurrency = createAction(
  SET_CURRENT_CURRENCY,
  (safeAddress: string, selectedCurrency: AVAILABLE_CURRENCIES) => ({
    safeAddress,
    selectedCurrency,
  }),
)
