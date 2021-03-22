import { Action } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'

import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'

import { loadSelectedCurrency } from 'src/logic/safe/utils/currencyValuesStorage'
import { AppReduxState } from 'src/store'
import { SelectedCurrencyPayload } from 'src/logic/currencyValues/store/reducer/currencyValues'

export const fetchSelectedCurrency = () => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, Action<SelectedCurrencyPayload>>,
): Promise<void> => {
  try {
    const storedSelectedCurrency = await loadSelectedCurrency()
    dispatch(setSelectedCurrency({ selectedCurrency: storedSelectedCurrency || 'USD' }))
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
