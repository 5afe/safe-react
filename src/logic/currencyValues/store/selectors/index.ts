import { List, Map, RecordOf } from 'immutable'
import { createSelector } from 'reselect'

import { CURRENCY_VALUES_KEY } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { AppReduxState } from 'src/store/index'
import {
  AVAILABLE_CURRENCIES,
  BalanceCurrencyRecord,
  CurrencyRateValue,
  CurrencyRateValueRecord,
} from 'src/logic/currencyValues/store/model/currencyValues'
import { BigNumber } from 'bignumber.js'

export const currencyValuesSelector = (state: AppReduxState): Map<string, RecordOf<CurrencyRateValue>> =>
  state[CURRENCY_VALUES_KEY]

export const safeFiatBalancesSelector = createSelector(
  currencyValuesSelector,
  safeParamAddressFromStateSelector,
  (currencyValues, safeAddress): CurrencyRateValueRecord => {
    if (!currencyValues) return
    return currencyValues.get(safeAddress)
  },
)

export const safeFiatBalancesListSelector = createSelector(
  safeFiatBalancesSelector,
  (currencyValuesMap): List<BalanceCurrencyRecord> => {
    if (!currencyValuesMap) return
    return currencyValuesMap.get('currencyBalances') ? currencyValuesMap.get('currencyBalances') : List([])
  },
)

export const currentCurrencySelector = createSelector(
  safeFiatBalancesSelector,
  (currencyValuesMap): AVAILABLE_CURRENCIES | null =>
    currencyValuesMap ? currencyValuesMap.get('selectedCurrency') : null,
)

export const currencyRateSelector = createSelector(safeFiatBalancesSelector, (currencyValuesMap): number | null =>
  currencyValuesMap ? currencyValuesMap.get('currencyRate') : null,
)

export const safeFiatBalancesTotalSelector = createSelector(
  safeFiatBalancesListSelector,
  currencyRateSelector,
  (currencyBalances, currencyRate): string | null => {
    if (!currencyBalances) return '0'
    if (!currencyRate) return null

    const totalInBaseCurrency = currencyBalances.reduce((total, balanceCurrencyRecord) => {
      return total.plus(balanceCurrencyRecord.balanceInBaseCurrency)
    }, new BigNumber(0))

    return totalInBaseCurrency.times(currencyRate).toFixed(2)
  },
)
