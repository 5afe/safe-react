// 

import { List } from 'immutable'

import { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'
import { } from '~/store'

export const currencyValuesListSelector = (state) =>
  state[CURRENCY_VALUES_KEY].get('currencyBalances') ? state[CURRENCY_VALUES_KEY].get('currencyBalances') : List([])
export const currentCurrencySelector = (state) => state[CURRENCY_VALUES_KEY].get('currencyValueSelected')
