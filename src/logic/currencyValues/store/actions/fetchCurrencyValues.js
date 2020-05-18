// 
import { List } from 'immutable'
import { batch } from 'react-redux'

import fetchCurrencyRate from 'src/logic/currencyValues/store/actions/fetchCurrencyRate'
import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencyRate } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { loadCurrencyValues } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'

export const fetchCurrencyValues = (safeAddress) => async (dispatch) => {
  try {
    const storedCurrencies = await loadCurrencyValues()
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
      const { currencyRate, selectedCurrency } = value
      batch(() => {
        dispatch(setSelectedCurrency(safeAddr, selectedCurrency))
        dispatch(setCurrencyRate(safeAddr, currencyRate))
        dispatch(fetchCurrencyRate(safeAddr, selectedCurrency))
        dispatch(fetchSafeTokens(safeAddress))
      })
    })
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
