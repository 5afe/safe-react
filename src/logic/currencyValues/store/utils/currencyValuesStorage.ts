import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { AVAILABLE_CURRENCIES } from '../model/currencyValues'

const SELECTED_CURRENCY_STORAGE_KEY = 'SELECTED_CURRENCY'
export const saveSelectedCurrency = async (selectedCurrency: AVAILABLE_CURRENCIES): Promise<void> => {
  try {
    await saveToStorage(SELECTED_CURRENCY_STORAGE_KEY, selectedCurrency)
  } catch (err) {
    console.error('Error storing currency values info in localstorage', err)
  }
}

export const loadSelectedCurrency = async (): Promise<AVAILABLE_CURRENCIES | undefined> => {
  return await loadFromStorage(SELECTED_CURRENCY_STORAGE_KEY)
}
