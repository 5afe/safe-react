// 
import { createAction } from 'redux-actions'

import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

// eslint-disable-next-line max-len
export const setCurrencySelected = createAction(
  SET_CURRENT_CURRENCY,
  (currencyValueSelected) => ({ currencyValueSelected }),
)
