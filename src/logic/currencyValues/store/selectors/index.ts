import { AppReduxState } from 'src/store'
import { CURRENCY_VALUES_KEY, CurrencyValuesState } from 'src/logic/currencyValues/store/reducer/currencyValues'

export const currencyValuesSelector = (state: AppReduxState): CurrencyValuesState => state[CURRENCY_VALUES_KEY]

export const currentCurrencySelector = (state: AppReduxState): string => {
  return state[CURRENCY_VALUES_KEY].selectedCurrency
}

export const availableCurrenciesSelector = (state: AppReduxState): string[] => {
  return state[CURRENCY_VALUES_KEY].availableCurrencies
}
