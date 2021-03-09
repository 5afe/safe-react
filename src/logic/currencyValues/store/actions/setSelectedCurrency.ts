import { Action, createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'

import { CurrencyPayloads } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { AppReduxState } from 'src/store'

export const SET_CURRENT_CURRENCY = 'SET_CURRENT_CURRENCY'

const setCurrentCurrency = createAction(SET_CURRENT_CURRENCY, (safeAddress: string, selectedCurrency: string) => ({
  safeAddress,
  selectedCurrency,
}))

export const setSelectedCurrency = (safeAddress: string, selectedCurrency: string) => (
  dispatch: ThunkDispatch<AppReduxState, undefined, Action<CurrencyPayloads>>,
): void => {
  dispatch(setCurrentCurrency(safeAddress, selectedCurrency))
}
