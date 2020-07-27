import { createSelector } from 'reselect'

import {
  CURRENCY_VALUES_KEY,
  CurrencyReducerMap,
  CurrencyValuesState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { CurrencyRateValue } from '../model/currencyValues'

export const currencyValuesSelector = (state: AppReduxState): CurrencyValuesState => state[CURRENCY_VALUES_KEY]

export const safeFiatBalancesSelector = createSelector(
  currencyValuesSelector,
  safeParamAddressFromStateSelector,
  (currencyValues, safeAddress) => {
    if (!currencyValues) return
    return currencyValues.get(safeAddress)
  },
)

const currencyValueSelector = <K extends keyof CurrencyRateValue>(key: K) => (
  currencyValuesMap?: CurrencyReducerMap,
): CurrencyRateValue[K] => currencyValuesMap?.get(key) || null

export const safeFiatBalancesListSelector = createSelector(
  safeFiatBalancesSelector,
  currencyValueSelector('currencyBalances'),
)

export const currentCurrencySelector = createSelector(
  safeFiatBalancesSelector,
  currencyValueSelector('selectedCurrency'),
)

export const currencyRateSelector = createSelector(safeFiatBalancesSelector, currencyValueSelector('currencyRate'))
