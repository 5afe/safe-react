import { getStoragePrefix, loadFromStorage, saveToStorage } from 'src/utils/storage'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { getNetworkName } from 'src/config'

export const SAFES_KEY = 'SAFES'

export type StoredSafes = Record<string, SafeRecordProps>

export const loadStoredSafes = (): Promise<StoredSafes | undefined> => {
  return loadFromStorage<StoredSafes>(SAFES_KEY)
}

export const loadStoredNetworkSafeById = (id: ETHEREUM_NETWORK): Promise<StoredSafes | undefined> => {
  const networkName = getNetworkName(id)
  return loadFromStorage<StoredSafes>(SAFES_KEY, getStoragePrefix(networkName))
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

export const getLocalNetworkSafesById = async (id: ETHEREUM_NETWORK): Promise<SafeRecordProps[] | undefined> => {
  const storedSafes = await loadStoredNetworkSafeById(id)
  return storedSafes ? Object.values(storedSafes) : undefined
}

export const getLocalSafe = async (safeAddress: string): Promise<SafeRecordProps | undefined> => {
  const storedSafes = await loadStoredSafes()
  return storedSafes?.[safeAddress]
}
