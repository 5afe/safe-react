import { List } from 'immutable'
import { batch } from 'react-redux'

import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencyRate } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AVAILABLE_CURRENCIES, CurrencyRateValue } from 'src/logic/currencyValues/store/model/currencyValues'
import { loadCurrencyValues } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'

export const fetchCurrencyValues = (safeAddress: string) => async (dispatch) => {
  try {
    const storedCurrencies: Map<string, CurrencyRateValue> | any = await loadCurrencyValues()
    const storedCurrency = storedCurrencies[safeAddress]
    if (!storedCurrency) {
      return batch(() => {
        dispatch(setCurrencyBalances(safeAddress, List([])))
        dispatch(setSelectedCurrency(safeAddress, AVAILABLE_CURRENCIES.USD))
        dispatch(setCurrencyRate(safeAddress, 1))
      })
    }
    // Loads the stored state on redux
    Object.entries(storedCurrencies).forEach((kv) => {
      const safeAddr = kv[0]
      const value = kv[1]

      let { currencyRate, selectedCurrency }: CurrencyRateValue = value

      // Fallback for users that got an undefined saved on localStorage
      if (!selectedCurrency || selectedCurrency === AVAILABLE_CURRENCIES.USD) {
        currencyRate = 1
        selectedCurrency = AVAILABLE_CURRENCIES.USD
      }

      batch(() => {
        dispatch(setSelectedCurrency(safeAddr, selectedCurrency))
        dispatch(setCurrencyRate(safeAddr, currencyRate))
      })
    })
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
