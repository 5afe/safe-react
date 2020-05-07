// @flow
import { createAction } from 'redux-actions'

import type { CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

// eslint-disable-next-line max-len
export const setSelectedCurrency = createAction<string, *>(
  SET_CURRENT_CURRENCY,
  (safeAddress: string, selectedCurrency: $Keys<typeof AVAILABLE_CURRENCIES>): CurrencyValuesProps => ({
    safeAddress,
    selectedCurrency,
  }),
)
