import axios from 'axios'
import BigNumber from 'bignumber.js'

import { EXCHANGE_RATE_URL } from 'src/utils/constants'
import { fetchTokenCurrenciesBalances } from './fetchTokenCurrenciesBalances'
import { sameString } from 'src/utils/strings'
import { AVAILABLE_CURRENCIES } from '../store/model/currencyValues'

const fetchCurrenciesRates = async (
  baseCurrency: string,
  targetCurrencyValue: string,
  safeAddress: string,
): Promise<number> => {
  let rate = 0
  if (sameString(targetCurrencyValue, AVAILABLE_CURRENCIES.NETWORK)) {
    try {
      const result = await fetchTokenCurrenciesBalances(safeAddress)
      if (result?.data?.length) {
        rate = new BigNumber(1).div(result.data[0].fiatConversion).toNumber()
      }
    } catch (error) {
      console.error(`Fetching ${AVAILABLE_CURRENCIES.NETWORK} data from the relayer errored`, error)
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
