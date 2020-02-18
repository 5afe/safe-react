// @flow

import { List } from 'immutable'
import { type GlobalState } from '~/store'
import { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'

export const currencyValuesListSelector = (state: GlobalState) =>
  state[CURRENCY_VALUES_KEY].get('currencyBalances') ? state[CURRENCY_VALUES_KEY].get('currencyBalances') : List([])
export const currentCurrencySelector = (state: GlobalState) => state[CURRENCY_VALUES_KEY].get('currencyValueSelected')
