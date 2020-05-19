import axios from 'axios'

import { getExchangeRatesUrl } from 'src/config'
import { AVAILABLE_CURRENCIES } from '../store/model/currencyValues'

type Currency = keyof typeof AVAILABLE_CURRENCIES

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
