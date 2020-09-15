import { createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { AppReduxState } from 'src/store'
import { AVAILABLE_CURRENCIES } from '../model/currencyValues'
import fetchCurrencyRate from 'src/logic/currencyValues/store/actions/fetchCurrencyRate'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

const setCurrentCurrency = createAction(
  SET_CURRENT_CURRENCY,
  (safeAddress: string, selectedCurrency: AVAILABLE_CURRENCIES) => ({
    safeAddress,
    selectedCurrency,
  }),
)

export const setSelectedCurrency = (safeAddress: string, selectedCurrency: AVAILABLE_CURRENCIES) => (
  dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>,
): void => {
  dispatch(setCurrentCurrency(safeAddress, selectedCurrency))
  dispatch(fetchCurrencyRate(safeAddress, selectedCurrency))
}
