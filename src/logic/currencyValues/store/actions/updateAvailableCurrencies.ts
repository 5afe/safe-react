import { Action } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { AppReduxState } from 'src/store'
import { AvailableCurrenciesPayload } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { setAvailableCurrencies } from 'src/logic/currencyValues/store/actions/setAvailableCurrencies'
import { fetchAvailableCurrencies } from 'src/logic/currencyValues/api/fetchAvailableCurrencies'

export const updateAvailableCurrencies = () => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, Action<AvailableCurrenciesPayload>>,
): Promise<void> => {
  try {
    const availableCurrencies = await fetchAvailableCurrencies()
    dispatch(setAvailableCurrencies({ availableCurrencies }))
  } catch (err) {
    console.error('Error fetching available currencies', err)
  }
  return Promise.resolve()
}
