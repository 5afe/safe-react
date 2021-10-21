import { AppReduxState } from 'src/store'
import { CURRENCY_REDUCER_ID, CurrencyValuesState } from 'src/logic/currencyValues/store/reducer/currencyValues'

export const currencyValuesSelector = (state: AppReduxState): CurrencyValuesState => state[CURRENCY_REDUCER_ID]

export const currentCurrencySelector = (state: AppReduxState): string => {
  return state[CURRENCY_REDUCER_ID].selectedCurrency
}

export const availableCurrenciesSelector = (state: AppReduxState): string[] => {
  return state[CURRENCY_REDUCER_ID].availableCurrencies
}
