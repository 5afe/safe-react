// @flow
import { Map } from 'immutable'
import { createAction } from 'redux-actions'
import type { CurrencyValues, CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENCY_BALANCES = 'SET_CURRENCY_BALANCES'


// eslint-disable-next-line max-len
export const setCurrencyBalances = createAction<string, *>(SET_CURRENCY_BALANCES, (currencyBalances: Map<string, CurrencyValues>): CurrencyValuesProps => ({ currencyBalances }))
