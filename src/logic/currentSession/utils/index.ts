import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { SerializedSessionState } from 'src/logic/currentSession/store/reducer/currentSession'

const CURRENT_SESSION_STORAGE_KEY = 'CURRENT_SESSION'

export const getCurrentSessionFromStorage = async (): Promise<SerializedSessionState | undefined> =>
  loadFromStorage(CURRENT_SESSION_STORAGE_KEY)

export const saveCurrentSessionToStorage = async (currentSession: SerializedSessionState): Promise<void> => {
  try {
    await saveToStorage(CURRENT_SESSION_STORAGE_KEY, currentSession)
  } catch (err) {
    console.error('Error storing currentSession in localStorage', err)
  }
}
