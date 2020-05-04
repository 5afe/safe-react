// @flow

import { List } from 'immutable'
import { type OutputSelector, createSelector } from 'reselect'

import type { CurrencyValuesEntry, CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'
import { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'

export const currencyValuesSelector = (state: GlobalState): CurrencyValuesEntry =>
  state[CURRENCY_VALUES_KEY].get('currencyValues')

export const safeFiatBalancesSelector: OutputSelector<GlobalState> = createSelector(
  currencyValuesSelector,
  safeParamAddressFromStateSelector,
  (currencyValues: CurrencyValuesProps, safeAddress: string) => {
    if (!currencyValues) return
    return currencyValues.get(safeAddress)
  },
)

export const safeFiatBalancesListSelector: OutputSelector<GlobalState> = createSelector(
  safeFiatBalancesSelector,
  (currencyValuesMap: CurrencyValuesProps) => {
    if (!currencyValuesMap) return
    return currencyValuesMap.get('currencyBalances') ? currencyValuesMap.get('currencyBalances') : List([])
  },
)

export const currentCurrencySelector: OutputSelector<GlobalState> = createSelector(
  safeFiatBalancesSelector,
  (currencyValuesMap?: CurrencyValuesProps) =>
    currencyValuesMap ? currencyValuesMap.get('currencyValueSelected') : null,
)

export const currencyRateSelector: OutputSelector<GlobalState> = createSelector(
  safeFiatBalancesSelector,
  (currencyValuesMap: CurrencyValuesProps) => (currencyValuesMap ? currencyValuesMap.get('currencyRate') : null),
)
