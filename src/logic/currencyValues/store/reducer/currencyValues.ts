import { Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { BalanceCurrencyList, CurrencyRateValue } from 'src/logic/currencyValues/store/model/currencyValues'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export interface CurrencyReducerMap extends Map<string, any> {
  get<K extends keyof CurrencyRateValue>(key: K, notSetValue?: unknown): CurrencyRateValue[K]
  setIn<K extends keyof CurrencyRateValue>(keys: [string, K], value: CurrencyRateValue[K]): this
}

export type CurrencyValuesState = Map<string, CurrencyReducerMap>

type CurrencyBasePayload = { safeAddress: string }
export type CurrencyRatePayload = CurrencyBasePayload & { currencyRate: number }
export type CurrencyBalancesPayload = CurrencyBasePayload & { currencyBalances: BalanceCurrencyList }
export type CurrentCurrencyPayload = CurrencyBasePayload & { selectedCurrency: string }

export type CurrencyPayloads = CurrencyRatePayload | CurrencyBalancesPayload | CurrentCurrencyPayload

export default handleActions<CurrencyReducerMap, CurrencyPayloads>(
  {
    [SET_CURRENCY_RATE]: (state, action: Action<CurrencyRatePayload>) => {
      const { currencyRate, safeAddress } = action.payload

      return state.setIn([safeAddress, 'currencyRate'], currencyRate)
    },
    [SET_CURRENCY_BALANCES]: (state, action: Action<CurrencyBalancesPayload>) => {
      const { safeAddress, currencyBalances } = action.payload

      return state.setIn([safeAddress, 'currencyBalances'], currencyBalances)
    },
    [SET_CURRENT_CURRENCY]: (state, action: Action<CurrentCurrencyPayload>) => {
      const { safeAddress, selectedCurrency } = action.payload

      return state.setIn([safeAddress, 'selectedCurrency'], selectedCurrency)
    },
  },
  Map(),
)
