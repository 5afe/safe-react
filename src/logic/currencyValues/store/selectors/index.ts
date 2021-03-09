import { createSelector } from 'reselect'

import {
  CURRENCY_VALUES_KEY,
  CurrencyReducerMap,
  CurrencyValuesState,
} from 'src/logic/currencyValues/store/reducer/currencyValues'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { CurrencyRateValue } from 'src/logic/currencyValues/store/model/currencyValues'

export const currencyValuesSelector = (state: AppReduxState): CurrencyValuesState => state[CURRENCY_VALUES_KEY]

export const safeFiatBalancesSelector = createSelector(
  currencyValuesSelector,
  safeParamAddressFromStateSelector,
  (currencyValues, safeAddress): CurrencyReducerMap | undefined => {
    if (!currencyValues || !safeAddress) return
    return currencyValues.get(safeAddress)
  },
)

const currencyValueSelector = <K extends keyof CurrencyRateValue>(key: K) => (
  currencyValuesMap?: CurrencyReducerMap,
): CurrencyRateValue[K] => currencyValuesMap?.get(key)

export const safeFiatBalancesListSelector = createSelector(
  safeFiatBalancesSelector,
  currencyValueSelector('currencyBalances'),
)

export const currentCurrencySelector = createSelector(
  safeFiatBalancesSelector,
  currencyValueSelector('selectedCurrency'),
)
