import { getStoragePrefix, loadFromStorage, saveToStorage } from 'src/utils/storage'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { ChainId } from 'src/config/chain.d'

export const SAFES_KEY = 'SAFES'

export type StoredSafes = Record<string, SafeRecordProps>

export const loadStoredSafes = (): StoredSafes | undefined => {
  return loadFromStorage<StoredSafes>(SAFES_KEY)
}

export const loadStoredNetworkSafeById = (id: ChainId): StoredSafes | undefined => {
  return loadFromStorage<StoredSafes>(SAFES_KEY, getStoragePrefix(id))
}

export const saveSafes = (safes: StoredSafes): void => {
  saveToStorage(SAFES_KEY, safes)
}

export const getLocalSafes = (): SafeRecordProps[] | undefined => {
  const storedSafes = loadStoredSafes()
  return storedSafes ? Object.values(storedSafes) : undefined
}

export const getLocalNetworkSafesById = (id: ChainId): SafeRecordProps[] | undefined => {
  const storedSafes = loadStoredNetworkSafeById(id)
  return storedSafes ? Object.values(storedSafes) : undefined
}

export const getLocalSafe = (safeAddress: string): SafeRecordProps | undefined => {
  const storedSafes = loadStoredSafes()
  return storedSafes?.[safeAddress]
}
