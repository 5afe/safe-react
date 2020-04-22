// @flow
import { createAction } from 'redux-actions'

import type { CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENCY_RATE = 'SET_CURRENCY_RATE'

// eslint-disable-next-line max-len
export const setCurrencyRate = createAction<string, *>(
  SET_CURRENCY_RATE,
  (currencyRate: string): CurrencyValuesProps => ({ currencyRate }),
)
