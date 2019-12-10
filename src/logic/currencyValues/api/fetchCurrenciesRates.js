// @flow
import axios from 'axios'
import { getExchangeRatesUrl } from '~/config'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'

const fetchCurrenciesRates = async (baseCurrency: AVAILABLE_CURRENCIES, targetCurrencyValue: AVAILABLE_CURRENCIES): Promise<number> => {
  let rates = null
  const url = `${getExchangeRatesUrl()}?base=${baseCurrency}&symbols=${targetCurrencyValue}`

  const result = await axios.get(url)
  if (result && result.data) {
    rates = result.data.rates
  }

  return rates[targetCurrencyValue]
}

export default fetchCurrenciesRates
