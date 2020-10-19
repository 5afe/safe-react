import axios from 'axios'

import { EXCHANGE_RATE_URL } from 'src/utils/constants'
import { AVAILABLE_CURRENCIES } from '../store/model/currencyValues'
import { fetchTokenCurrenciesBalances } from './fetchTokenCurrenciesBalances'
import BigNumber from 'bignumber.js'

const fetchCurrenciesRates = async (
  baseCurrency: AVAILABLE_CURRENCIES,
  targetCurrencyValue: AVAILABLE_CURRENCIES,
  safeAddress: string,
): Promise<number> => {
  let rate = 0

  if (targetCurrencyValue === AVAILABLE_CURRENCIES.ETH) {
    try {
      const result = await fetchTokenCurrenciesBalances(safeAddress)
      if (result?.data?.length) {
        rate = new BigNumber(1).div(result.data[0].fiatConversion).toNumber()
      }
    } catch (error) {
      console.error('Fetching ETH data from the relayer errored', error)
    }
    return rate
  }

  try {
    const url = `${EXCHANGE_RATE_URL}?base=${baseCurrency}&symbols=${targetCurrencyValue}`
    const result = await axios.get(url)
    if (result?.data) {
      const { rates } = result.data
      rate = rates[targetCurrencyValue] ? rates[targetCurrencyValue] : 0
    }
  } catch (error) {
    console.error('Fetching data from getExchangeRatesUrl errored', error)
  }
  return rate
}

export default fetchCurrenciesRates
