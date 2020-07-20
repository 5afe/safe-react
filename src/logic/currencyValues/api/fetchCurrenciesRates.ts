import axios from 'axios'

import { getExchangeRatesUrl, getExchangeRatesUrlFallback } from 'src/config'
import { AVAILABLE_CURRENCIES } from '../store/model/currencyValues'

const fetchCurrenciesRates = async (
  baseCurrency: AVAILABLE_CURRENCIES,
  targetCurrencyValue: AVAILABLE_CURRENCIES,
): Promise<number> => {
  let rate = 0
  const url = `${getExchangeRatesUrl()}?base=${baseCurrency}&symbols=${targetCurrencyValue}`
  const fallbackUrl = `${getExchangeRatesUrlFallback()}?currency=${baseCurrency}`

  try {
    const result = await axios.get(url)
    if (result && result.data) {
      const { rates } = result.data
      rate = rates[targetCurrencyValue] ? rates[targetCurrencyValue] : 0
    }
  } catch (error) {
    console.error('Fetching data from getExchangeRatesUrl errored', error)
    try {
      const result = await axios.get(fallbackUrl)
      if (result && result.data) {
        const { rates } = result.data.data
        rate = rates[targetCurrencyValue] ? rates[targetCurrencyValue] : 0
      }
    } catch (error) {
      console.error('Fetching data from exchangesRatesApiFallback errored', error)
    }
  }

  return rate
}

export default fetchCurrenciesRates
