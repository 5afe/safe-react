import { createAction } from 'redux-actions'
import { AvailableCurrenciesPayload } from 'src/logic/currencyValues/store/reducer/currencyValues'

export const SET_AVAILABLE_CURRENCIES = 'SET_AVAILABLE_CURRENCIES'

export const setAvailableCurrencies = createAction<AvailableCurrenciesPayload>(SET_AVAILABLE_CURRENCIES)
