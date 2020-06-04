import axios from 'axios'

import { getExchangeRatesUrl } from 'src/config'
import { Currency } from '../store/model/currencyValues'

const fetchCurrenciesRates = async (baseCurrency: Currency, targetCurrencyValue: Currency): Promise<number> => {
  let rate = 0
  const url = `${getExchangeRatesUrl()}?base=${baseCurrency}&symbols=${targetCurrencyValue}`

  const result = await axios.get(url)
  if (result && result.data) {
    const { rates } = result.data
    rate = rates[targetCurrencyValue] ? rates[targetCurrencyValue] : 0
  }

  return rate
}

export default fetchCurrenciesRates
