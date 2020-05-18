// 
import axios from 'axios'

import { getExchangeRatesUrl } from 'src/config'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'

const fetchCurrenciesRates = async (
  baseCurrency,
  targetCurrencyValue,
) => {
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
