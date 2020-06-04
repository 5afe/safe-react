import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { CurrencyRateValue } from '../model/currencyValues'

const CURRENCY_VALUES_STORAGE_KEY = 'CURRENCY_VALUES_STORAGE_KEY'
export const saveCurrencyValues = async (currencyValues: Map<string, CurrencyRateValue>) => {
  try {
    await saveToStorage(CURRENCY_VALUES_STORAGE_KEY, currencyValues)
  } catch (err) {
    console.error('Error storing currency values info in localstorage', err)
  }
}

export const loadCurrencyValues = async (): Promise<Map<string, CurrencyRateValue> | {}> => {
  return (await loadFromStorage(CURRENCY_VALUES_STORAGE_KEY)) || {}
}
