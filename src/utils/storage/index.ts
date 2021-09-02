import { ImmortalStorage, IndexedDbStore, LocalStorageStore } from 'immortal-db'

import { getNetworkName } from 'src/config'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

// Don't use sessionStorage and cookieStorage
// https://github.com/gruns/ImmortalDB/issues/22
// https://github.com/gruns/ImmortalDB/issues/6
const stores = [IndexedDbStore, LocalStorageStore]
export const storage = new ImmortalStorage(stores)

const PREFIX = `v2_${getNetworkName()}`

export const loadFromStorage = async <T = unknown>(key: string): Promise<T | undefined> => {
  try {
    const stringifiedValue = await storage.get(`${PREFIX}__${key}`)
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
    await storage.set(`${PREFIX}__${key}`, stringifiedValue)
  } catch (err) {
    logError(Errors._701, `key ${key} – ${err.message}`)
  }
}

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await storage.remove(`${PREFIX}__${key}`)
  } catch (err) {
    logError(Errors._702, `key ${key} – ${err.message}`)
  }
}

export const setLocalStorageWithExpiry = <T = unknown>(key: string, value: T, expireAfter: number) => {
  const item = {
    value,
    expiry: new Date().getTime() + expireAfter,
  }

  localStorage.setItem(key, JSON.stringify(item))
}

export const getLocalStorageWithExpiry = (key: string) => {
  const itemString = window.localStorage.getItem(key)

  if (!itemString) return null

  const item = JSON.parse(itemString)

  const isExpired = new Date().getTime() > item.expiry

  if (isExpired) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
