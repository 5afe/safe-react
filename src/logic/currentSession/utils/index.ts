import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { CurrentSessionState } from 'src/logic/currentSession/store/reducer/currentSession'

const CURRENT_SESSION_STORAGE_KEY = 'CURRENT_SESSION'

export const getCurrentSessionFromStorage = async (): Promise<CurrentSessionState | undefined> =>
  loadFromStorage(CURRENT_SESSION_STORAGE_KEY)

export const saveCurrentSessionToStorage = async (currentSession) => {
  try {
    await saveToStorage(CURRENT_SESSION_STORAGE_KEY, currentSession)
  } catch (err) {
    console.error('Error storing currentSession in localStorage', err)
  }
}
