import { List } from 'immutable'
import { batch } from 'react-redux'

import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencyRate } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { loadCurrencyValues } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'

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

      const { currencyRate, selectedCurrency }: any = value
      batch(() => {
        dispatch(setSelectedCurrency(safeAddr, selectedCurrency || AVAILABLE_CURRENCIES.USD))
        dispatch(setCurrencyRate(safeAddr, currencyRate || 1))
      })
    })
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
