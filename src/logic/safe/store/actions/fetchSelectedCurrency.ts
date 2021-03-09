import { Action } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'

import { setSelectedCurrency } from 'src/logic/safe/store/actions/setSelectedCurrency'

import { loadSelectedCurrency } from 'src/logic/safe/utils/currencyValuesStorage'
import { AppReduxState } from 'src/store'
import { AVAILABLE_CURRENCIES } from 'src/logic/safe/store/models/availableCurrencies'
import { SelectedCurrencyPayload } from 'src/logic/safe/store/reducer/safe'

export const fetchSelectedCurrency = () => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, Action<SelectedCurrencyPayload>>,
): Promise<void> => {
  try {
    const storedSelectedCurrency = await loadSelectedCurrency()

    dispatch(setSelectedCurrency({ selectedCurrency: storedSelectedCurrency || AVAILABLE_CURRENCIES.USD }))
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
