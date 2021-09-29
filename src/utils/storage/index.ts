import { ImmortalStorage, IndexedDbStore, LocalStorageStore } from 'immortal-db'

import { getNetworkName } from 'src/config'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

// Don't use sessionStorage and cookieStorage
// https://github.com/gruns/ImmortalDB/issues/22
// https://github.com/gruns/ImmortalDB/issues/6
const stores = [IndexedDbStore, LocalStorageStore]
export const storage = new ImmortalStorage(stores)

// We need this to update on run time depending on selected network name
export const getStoragePrefix = (networkName = getNetworkName()): string => `v2_${networkName}`

export const loadFromStorage = async <T = unknown>(
  key: string,
  prefix = getStoragePrefix(),
): Promise<T | undefined> => {
  try {
    const stringifiedValue = await storage.get(`${prefix}__${key}`)
    if (stringifiedValue === null || stringifiedValue === undefined) {
      return undefined
    }

    return JSON.parse(stringifiedValue)
  } catch (err) {
    logError(Errors._700, `key ${key} – ${err.message}`)
    return undefined
  }
}

export const saveToStorage = async <T = unknown>(key: string, value: T): Promise<void> => {
  try {
    const stringifiedValue = JSON.stringify(value)
    await storage.set(`${getStoragePrefix()}__${key}`, stringifiedValue)
  } catch (err) {
    logError(Errors._701, `key ${key} – ${err.message}`)
  }
}

// This function is only meant to be used in L2-UX migration to gather information from other networks
export const saveMigratedKeyToStorage = async <T = unknown>(key: string, value: T): Promise<void> => {
  try {
    const stringifiedValue = JSON.stringify(value)
    await storage.set(key, stringifiedValue)
  } catch (err) {
    logError(Errors._703, `key ${key} – ${err.message}`)
  }
}

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await storage.remove(`${getStoragePrefix()}__${key}`)
  } catch (err) {
    logError(Errors._702, `key ${key} – ${err.message}`)
  }
}
