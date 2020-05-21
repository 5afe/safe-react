import fetchCurrenciesRates from 'src/logic/currencyValues/api/fetchCurrenciesRates'
import { setCurrencyRate } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'

// eslint-disable-next-line max-len
const fetchCurrencyRate = (safeAddress, selectedCurrency) => async (dispatch) => {
  if (AVAILABLE_CURRENCIES.USD === selectedCurrency) {
    return dispatch(setCurrencyRate(safeAddress, 1))
  }

  const selectedCurrencyRateInBaseCurrency = await fetchCurrenciesRates(
    AVAILABLE_CURRENCIES.USD as any,
    selectedCurrency as any,
  )
  dispatch(setCurrencyRate(safeAddress, selectedCurrencyRateInBaseCurrency))
}

export default fetchCurrencyRate
