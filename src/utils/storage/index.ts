import { _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import Storage from './Storage'

// Legacy storage keys. New chains will use the chain id as prefix.
// @TODO: migrate them to chain ids.
const STORAGE_KEYS: Record<ChainId, string> = {
  '1': 'MAINNET',
  '4': 'RINKEBY',
  '56': 'BSC',
  '100': 'XDAI',
  '137': 'POLYGON',
  '246': 'ENERGY_WEB_CHAIN',
  '42161': 'ARBITRUM',
  '73799': 'VOLTA',
}

export const storage = new Storage(window.localStorage, '')

export const getStoragePrefix = (id = _getChainId()): string => {
  const name = STORAGE_KEYS[id] || id
  // Legacy ImmortalDB prefix
  // @TODO: migrate it
  return `_immortal|v2_${name}__`
}

export const loadFromStorage = <T = unknown>(key: string, prefix = getStoragePrefix()): T | undefined => {
  return storage.getItem(`${prefix}${key}`)
}

export const saveToStorage = <T = unknown>(key: string, value: T): void => {
  storage.setItem<T>(`${getStoragePrefix()}${key}`, value)
}

export const removeFromStorage = (key: string): void => {
  storage.removeItem(`${getStoragePrefix()}${key}`)
}

export const saveToStorageWithExpiry = <T = unknown>(key: string, value: T, expiry: number): void => {
  storage.setWithExpiry<T>(key, value, expiry)
}

export const loadFromStorageWithExpiry = <T = unknown>(key: string): T | undefined => {
  return storage.getWithExpiry<T>(key)
}
