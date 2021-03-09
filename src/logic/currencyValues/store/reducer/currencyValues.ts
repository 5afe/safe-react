import { Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { BalanceCurrencyList, CurrencyRateValue } from 'src/logic/currencyValues/store/model/currencyValues'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'

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
    [SET_CURRENT_CURRENCY]: (state, action: Action<CurrentCurrencyPayload>) => {
      const { safeAddress, selectedCurrency } = action.payload

      return state.setIn([safeAddress, 'selectedCurrency'], selectedCurrency)
    },
  },
  Map(),
)
