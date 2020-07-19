import { List, Map, RecordOf } from 'immutable'
import { createSelector } from 'reselect'

import { CURRENCY_VALUES_KEY } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { AppReduxState } from '../../../../store'
import { CurrencyRateValue } from '../model/currencyValues'

export const currencyValuesSelector = (state: AppReduxState): Map<string, RecordOf<CurrencyRateValue>> =>
  state[CURRENCY_VALUES_KEY]

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

export const safeFiatBalancesTotalSelector = createSelector(safeFiatBalancesListSelector, (currencyBalances) => {
  if (!currencyBalances) return 0

  return currencyBalances
    .map((balanceRecord) => balanceRecord.balanceInSelectedCurrency)
    .reduce((accumulator, currentBalanceInSelectedCurrency) => {
      return accumulator + parseFloat(currentBalanceInSelectedCurrency)
    }, 0)
})
