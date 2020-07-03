import { loadFromStorage, saveToStorage } from 'src/utils/storage'

export const SAFES_KEY = 'SAFES'
export const TX_KEY = 'TX'
export const DEFAULT_SAFE_KEY = 'DEFAULT_SAFE'

export const getSafeName = async (safeAddress) => {
  const safes = await loadFromStorage(SAFES_KEY)
  if (!safes) {
    return undefined
  }
  const safe = safes[safeAddress]

  return safe ? safe.name : undefined
}

export const saveSafes = async (safes) => {
  try {
    await saveToStorage(SAFES_KEY, safes)
  } catch (err) {
    console.error('Error storing Safe info in localstorage', err)
  }
}

export const getLocalSafe = async (safeAddress) => {
  const storedSafes = (await loadFromStorage(SAFES_KEY)) || {}
  return storedSafes[safeAddress]
}

export const getDefaultSafe = async (): Promise<string> => {
  const defaultSafe = await loadFromStorage<string>(DEFAULT_SAFE_KEY)

  return defaultSafe || ''
}

export const saveDefaultSafe = async (safeAddress) => {
  try {
    await saveToStorage(DEFAULT_SAFE_KEY, safeAddress)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error saving default Safe to storage: ', err)
  }
}
