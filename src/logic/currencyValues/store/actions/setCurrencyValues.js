// @flow
import { Map } from 'immutable'
import { createAction } from 'redux-actions'
import type { CurrencyValues, CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENCY_VALUES = 'SET_CURRENCY_VALUES'


// eslint-disable-next-line max-len
export const setCurrencyValues = createAction<string, *>(SET_CURRENCY_VALUES, (currencyValues: Map<string, CurrencyValues>): CurrencyValuesProps => ({ currencyValues }))
