// 
import { createAction } from 'redux-actions'

import { AVAILABLE_CURRENCIES } from 'logic/currencyValues/store/model/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

// eslint-disable-next-line max-len
export const setSelectedCurrency = createAction(
  SET_CURRENT_CURRENCY,
  (safeAddress, selectedCurrency) => ({
    safeAddress,
    selectedCurrency,
  }),
)
