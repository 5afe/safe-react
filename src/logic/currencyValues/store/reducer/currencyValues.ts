import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { CurrencyRateValue } from 'src/logic/currencyValues/store/model/currencyValues'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export interface CurrencyReducerMap extends Map<string, any> {
  get<K extends keyof CurrencyRateValue>(key: K, notSetValue?: unknown): CurrencyRateValue[K]
  setIn<K extends keyof CurrencyRateValue>(keys: [string, K], value: CurrencyRateValue[K]): this
}

export type CurrencyValuesState = Map<string, CurrencyReducerMap>

export default handleActions(
  {
    [SET_CURRENCY_RATE]: (state: CurrencyReducerMap, action) => {
      const { currencyRate, safeAddress } = action.payload

      return state.setIn([safeAddress, 'currencyRate'], currencyRate)
    },
    [SET_CURRENCY_BALANCES]: (state: CurrencyReducerMap, action) => {
      const { currencyBalances, safeAddress } = action.payload

      return state.setIn([safeAddress, 'currencyBalances'], currencyBalances)
    },
    [SET_CURRENT_CURRENCY]: (state: CurrencyReducerMap, action) => {
      const { safeAddress, selectedCurrency } = action.payload

      return state.setIn([safeAddress, 'selectedCurrency'], selectedCurrency)
    },
  },
  Map(),
)
