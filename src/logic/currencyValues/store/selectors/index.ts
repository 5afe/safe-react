import { List } from 'immutable'
import { createSelector } from 'reselect'

import { CURRENCY_VALUES_KEY, CurrencyValuesState } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { AppReduxState } from 'src/store'

export const currencyValuesSelector = (state: AppReduxState): CurrencyValuesState => state[CURRENCY_VALUES_KEY]

export const safeFiatBalancesSelector = createSelector(
  currencyValuesSelector,
  safeParamAddressFromStateSelector,
  (currencyValues, safeAddress) => {
    if (!currencyValues) return
    return currencyValues.get(safeAddress)
  },
)

export const safeFiatBalancesListSelector = createSelector(safeFiatBalancesSelector, (currencyValuesMap) => {
  if (!currencyValuesMap) return
  return currencyValuesMap.get('currencyBalances') ? currencyValuesMap.get('currencyBalances') : List([])
})

export const currentCurrencySelector = createSelector(safeFiatBalancesSelector, (currencyValuesMap) =>
  currencyValuesMap ? currencyValuesMap.get('selectedCurrency') : null,
)

export const currencyRateSelector = createSelector(safeFiatBalancesSelector, (currencyValuesMap) =>
  currencyValuesMap ? currencyValuesMap.get('currencyRate') : null,
)
