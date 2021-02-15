import { Action } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'

import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { CurrentCurrencyPayload } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { loadSelectedCurrency } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'
import { AppReduxState } from 'src/store'

export const fetchSelectedCurrency = (safeAddress: string) => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, Action<CurrentCurrencyPayload>>,
): Promise<void> => {
  try {
    const storedSelectedCurrency = await loadSelectedCurrency()

    dispatch(setSelectedCurrency(safeAddress, storedSelectedCurrency || AVAILABLE_CURRENCIES.USD))
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
