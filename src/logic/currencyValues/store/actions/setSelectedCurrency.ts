import { createAction } from 'redux-actions'
import { SelectedCurrencyPayload } from 'src/logic/currencyValues/store/reducer/currencyValues'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

export const setSelectedCurrency = createAction<SelectedCurrencyPayload>(SET_CURRENT_CURRENCY)
