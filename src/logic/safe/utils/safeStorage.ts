import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'

export const SAFES_KEY = 'SAFES'
export const DEFAULT_SAFE_KEY = 'DEFAULT_SAFE'

type StoredSafes = Record<string, SafeRecordProps>

export const loadStoredSafes = (): Promise<StoredSafes | undefined> => {
  return loadFromStorage<StoredSafes>(SAFES_KEY)
}

export const saveSafes = async (safes: StoredSafes): Promise<void> => {
  try {
    await saveToStorage(SAFES_KEY, safes)
  } catch (err) {
    console.error('Error storing Safe info in localstorage', err)
  }
}

export const getLocalSafe = async (safeAddress: string): Promise<SafeRecordProps | undefined> => {
  const storedSafes = await loadStoredSafes()
  return storedSafes?.[safeAddress]
}

export const getDefaultSafe = async (): Promise<string> => {
  const defaultSafe = await loadFromStorage<string>(DEFAULT_SAFE_KEY)

  return defaultSafe || ''
}

export const saveDefaultSafe = async (safeAddress: string): Promise<void> => {
  try {
    await saveToStorage(DEFAULT_SAFE_KEY, safeAddress)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error saving default Safe to storage: ', err)
  }
}
