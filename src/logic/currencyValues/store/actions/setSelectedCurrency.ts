import { createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { AppReduxState } from 'src/store'
import fetchCurrencyRate from 'src/logic/currencyValues/store/actions/fetchCurrencyRate'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

const setCurrentCurrency = createAction(SET_CURRENT_CURRENCY, (safeAddress: string, selectedCurrency: string) => ({
  safeAddress,
  selectedCurrency,
}))

export const setSelectedCurrency = (safeAddress: string, selectedCurrency: string) => (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): void => {
  dispatch(setCurrentCurrency(safeAddress, selectedCurrency))
  dispatch(fetchCurrencyRate(safeAddress, selectedCurrency))
}
