// @flow
import { Map } from 'immutable'

import type { CurrencyValuesEntry } from '~/logic/currencyValues/store/model/currencyValues'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const CURRENCY_VALUES_STORAGE_KEY = 'CURRENCY_VALUES_STORAGE_KEY'
export const saveCurrencyValues = async (currencyValues: Map<string, CurrencyValuesEntry>) => {
  try {
    await saveToStorage(CURRENCY_VALUES_STORAGE_KEY, currencyValues)
  } catch (err) {
    console.error('Error storing currency values info in localstorage', err)
  }
}

export const loadCurrencyValues = async () => {
  return (await loadFromStorage(CURRENCY_VALUES_STORAGE_KEY)) || {}
}
