// @flow
1
import { createAction } from 'redux-actions'

import type { CurrencyValues, CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENCY_BALANCES = 'SET_CURRENCY_BALANCES'

// eslint-disable-next-line max-len
export const setCurrencyBalances = createAction<string, *>(
  SET_CURRENCY_BALANCES,
  (safeAddress: string, currencyBalances: List<CurrencyValues>): CurrencyValuesProps => ({
    safeAddress,
    currencyBalances,
  }),
)
