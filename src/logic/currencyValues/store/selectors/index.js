// @flow

import { type GlobalState } from '~/store'
import { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'


export const currencyValuesListSelector = (state: GlobalState) => state[CURRENCY_VALUES_KEY].get('currencyValuesList')
export const currentCurrencySelector = (state: GlobalState) => state[CURRENCY_VALUES_KEY].get('currencyValueSelected')
