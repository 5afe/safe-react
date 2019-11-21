// @flow
import { createAction } from 'redux-actions'
import type {
  CurrencyValuesProps,
  CurrencyValuesType,
} from '~/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'


// eslint-disable-next-line max-len
export const setCurrencySelected = createAction<string, *>(SET_CURRENT_CURRENCY, (currency: CurrencyValuesType): CurrencyValuesProps => ({ currencyValueSelected: currency }))
