import axios from 'axios'

import { getNetworkInfo } from 'src/config'
import { EXCHANGE_RATE_URL } from 'src/utils/constants'
import { fetchTokenCurrenciesBalances } from './fetchTokenCurrenciesBalances'
import BigNumber from 'bignumber.js'

const { nativeCoin } = getNetworkInfo()

const fetchCurrenciesRates = async (
  baseCurrency: string,
  targetCurrencyValue: string,
  safeAddress: string,
): Promise<number> => {
  let rate = 0

  if (targetCurrencyValue === nativeCoin.symbol.toUpperCase()) {
    try {
      const result = await fetchTokenCurrenciesBalances(safeAddress)
      if (result?.data?.length) {
        rate = new BigNumber(1).div(result.data[0].fiatConversion).toNumber()
      }
    } catch (error) {
      console.error(`Fetching ${nativeCoin.symbol} data from the relayer errored`, error)
    }
    return rate
  }

  // National currencies
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
