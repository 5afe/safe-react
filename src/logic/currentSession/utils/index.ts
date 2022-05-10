import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { CurrentSessionState } from 'src/logic/currentSession/store/reducer/currentSession'

const CURRENT_SESSION_STORAGE_KEY = 'CURRENT_SESSION'

export const getCurrentSessionFromStorage = (): CurrentSessionState | undefined =>
  loadFromStorage(CURRENT_SESSION_STORAGE_KEY)

export const saveCurrentSessionToStorage = (currentSession: CurrentSessionState): void => {
  saveToStorage(CURRENT_SESSION_STORAGE_KEY, currentSession)
}
