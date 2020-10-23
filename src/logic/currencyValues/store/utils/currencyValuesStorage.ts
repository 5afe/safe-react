import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const SELECTED_CURRENCY_STORAGE_KEY = 'SELECTED_CURRENCY'
export const saveSelectedCurrency = async (selectedCurrency: string): Promise<void> => {
  try {
    await saveToStorage(SELECTED_CURRENCY_STORAGE_KEY, selectedCurrency)
  } catch (err) {
    console.error('Error storing currency values info in localstorage', err)
  }
}

export const loadSelectedCurrency = async (): Promise<string | undefined> => {
  return await loadFromStorage(SELECTED_CURRENCY_STORAGE_KEY)
}
