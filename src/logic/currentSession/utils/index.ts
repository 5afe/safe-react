import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const CURRENT_SESSION_STORAGE_KEY = 'CURRENT_SESSION'

export const getCurrentSessionFromStorage = async () => loadFromStorage(CURRENT_SESSION_STORAGE_KEY)

export const saveCurrentSessionToStorage = async (currentSession) => {
  try {
    await saveToStorage(CURRENT_SESSION_STORAGE_KEY, currentSession.toJSON())
  } catch (err) {
    console.error('Error storing currentSession in localStorage', err)
  }
}
