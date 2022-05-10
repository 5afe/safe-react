import { Action, handleActions } from 'redux-actions'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { SET_AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/actions/setAvailableCurrencies'

export const CURRENCY_REDUCER_ID = 'currencyValues'

export type CurrencyValuesState = {
  selectedCurrency: string
  availableCurrencies: string[]
}

const defaultSelectedCurrency = 'USD'

export const initialCurrencyState = {
  selectedCurrency: defaultSelectedCurrency,
  availableCurrencies: [defaultSelectedCurrency],
}

export type SelectedCurrencyPayload = { selectedCurrency: string }
export type AvailableCurrenciesPayload = { availableCurrencies: string[] }

const currencyValuesReducer = handleActions<CurrencyValuesState, CurrencyValuesState>(
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
  initialCurrencyState,
)

export default currencyValuesReducer
