import { getNetworkName } from 'src/config'
import Storage from './Storage'

export const storage = new Storage(window.localStorage, '')

// We need this to update the key in runtime depending on selected network name
export const getStoragePrefix = (networkName = getNetworkName()): string => `_immortal|v2_${networkName}__`

export const loadFromStorage = async <T = unknown>(
  key: string,
  prefix = getStoragePrefix(),
): Promise<T | undefined> => {
  return storage.getItem(`${prefix}${key}`)
}

export const saveToStorage = async <T = unknown>(key: string, value: T): Promise<void> => {
  storage.setItem<T>(`${getStoragePrefix()}${key}`, value)
}

export const removeFromStorage = async (key: string): Promise<void> => {
  storage.removeItem(`${getStoragePrefix()}${key}`)
}

// This function is only meant to be used in L2-UX migration to gather information from other networks
export const saveMigratedKeyToStorage = async <T = unknown>(key: string, value: T): Promise<void> => {
  storage.setItem(key, value)
}
