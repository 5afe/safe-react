import { List, Map, RecordOf } from 'immutable'
import { createSelector } from 'reselect'

import { CURRENCY_VALUES_KEY } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { AppReduxState } from '../../../../store'
import { CurrencyRateValue } from '../model/currencyValues'
import { BigNumber } from 'bignumber.js'

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

export const safeFiatBalancesTotalSelector = createSelector(
  safeFiatBalancesListSelector,
  currencyRateSelector,
  (currencyBalances, currencyRate) => {
    if (!currencyBalances) return 0

    const totalInBaseCurrency = currencyBalances
      .map((balanceRecord) => balanceRecord.balanceInBaseCurrency)
      .reduce((accumulator, currentBalanceInSelectedCurrency) => {
        return accumulator + parseFloat(currentBalanceInSelectedCurrency)
      }, 0)
    return new BigNumber(totalInBaseCurrency).times(currencyRate).toFixed(2)
  },
)
