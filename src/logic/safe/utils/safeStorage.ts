import { getStoragePrefix, loadFromStorage, saveToStorage } from 'src/utils/storage'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { ChainId } from 'src/config/chain.d'

export const SAFES_KEY = 'SAFES'

export type StoredSafes = Record<string, SafeRecordProps>

export const loadStoredSafes = (): Promise<StoredSafes | undefined> => {
  return loadFromStorage<StoredSafes>(SAFES_KEY)
}

export const loadStoredNetworkSafeById = (id: ChainId): Promise<StoredSafes | undefined> => {
  return loadFromStorage<StoredSafes>(SAFES_KEY, getStoragePrefix(id))
}

export const saveSafes = async (safes: StoredSafes): Promise<void> => {
  try {
    await saveToStorage(SAFES_KEY, safes)
  } catch (err) {
    console.error('Error storing Safe info in localstorage', err)
  }
}

export const getLocalSafes = async (): Promise<SafeRecordProps[] | undefined> => {
  const storedSafes = await loadStoredSafes()
  return storedSafes ? Object.values(storedSafes) : undefined
}

export const getLocalNetworkSafesById = async (id: ChainId): Promise<SafeRecordProps[] | undefined> => {
  const storedSafes = await loadStoredNetworkSafeById(id)
  return storedSafes ? Object.values(storedSafes) : undefined
}

export const getLocalSafe = async (safeAddress: string): Promise<SafeRecordProps | undefined> => {
  const storedSafes = await loadStoredSafes()
  return storedSafes?.[safeAddress]
}
