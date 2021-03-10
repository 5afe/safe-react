import { Action, handleActions } from 'redux-actions'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AppReduxState } from 'src/store'
import { SET_AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/actions/setAvailableCurrencies'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export type CurrencyValuesState = {
  selectedCurrency: string
  availableCurrencies: string[]
}

export const initialState = {
  selectedCurrency: 'USD',
  availableCurrencies: ['USD'],
}

export type SelectedCurrencyPayload = { selectedCurrency: string }
export type AvailableCurrenciesPayload = { availableCurrencies: string[] }

export default handleActions<AppReduxState['currencyValues'], CurrencyValuesState>(
  {
    [SET_CURRENT_CURRENCY]: (state, action: Action<SelectedCurrencyPayload>) => {
      const { selectedCurrency } = action.payload
      state.selectedCurrency = selectedCurrency
      return state
    },
    [SET_AVAILABLE_CURRENCIES]: (state, action: Action<AvailableCurrenciesPayload>) => {
      const { availableCurrencies } = action.payload
      state.availableCurrencies = availableCurrencies
      return state
    },
  },
  initialState,
)
