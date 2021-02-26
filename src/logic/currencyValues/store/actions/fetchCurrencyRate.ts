import { Action } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'

import fetchCurrenciesRates from 'src/logic/currencyValues/api/fetchCurrenciesRates'
import { setCurrencyRate } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { CurrencyRatePayload } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { AppReduxState } from 'src/store'

const fetchCurrencyRate = (safeAddress: string, selectedCurrency: string) => async (
  dispatch: ThunkDispatch<AppReduxState, undefined, Action<CurrencyRatePayload>>,
): Promise<void> => {
  if (AVAILABLE_CURRENCIES.USD === selectedCurrency) {
    dispatch(setCurrencyRate(safeAddress, 1))
    return
  }

  const selectedCurrencyRateInBaseCurrency: number = await fetchCurrenciesRates(
    AVAILABLE_CURRENCIES.USD,
    selectedCurrency,
    safeAddress,
  )

  dispatch(setCurrencyRate(safeAddress, selectedCurrencyRateInBaseCurrency))
}

export default fetchCurrencyRate
