import { Action } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { AppReduxState } from 'src/store'
import { AvailableCurrenciesPayload } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { setAvailableCurrencies } from 'src/logic/currencyValues/store/actions/setAvailableCurrencies'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { getFiatCurrencies } from '@gnosis.pm/safe-react-gateway-sdk'

export const updateAvailableCurrencies =
  () =>
  async (dispatch: ThunkDispatch<AppReduxState, undefined, Action<AvailableCurrenciesPayload>>): Promise<void> => {
    try {
      const availableCurrencies = await getFiatCurrencies()
      dispatch(setAvailableCurrencies({ availableCurrencies }))
    } catch (err) {
      logError(Errors._607, err.message)
    }
    return Promise.resolve()
  }
