import { _getChainId } from 'src/config'
import { ChainId, CHAIN_ID } from 'src/config/chain.d'
import Storage from './Storage'

// Legacy storage keys. New chains will use the chain id as prefix.
// @TODO: migrate them to chain ids.
const STORAGE_KEYS: Record<ChainId, string> = {
  [CHAIN_ID.ETHEREUM]: 'MAINNET',
  [CHAIN_ID.RINKEBY]: 'RINKEBY',
  [CHAIN_ID.BSC]: 'BSC',
  [CHAIN_ID.GNOSIS_CHAIN]: 'XDAI',
  [CHAIN_ID.POLYGON]: 'POLYGON',
  [CHAIN_ID.ENERGY_WEB_CHAIN]: 'ENERGY_WEB_CHAIN',
  [CHAIN_ID.ARBITRUM]: 'ARBITRUM',
  [CHAIN_ID.VOLTA]: 'VOLTA',
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
