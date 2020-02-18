// @flow
import type { CurrentSession, CurrentSessionProps } from '~/logic/currentSession/store/model/currentSession'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const CURRENT_SESSION_STORAGE_KEY = 'CURRENT_SESSION'

export const getCurrentSessionFromStorage = async (): Promise<CurrentSessionProps | *> =>
  loadFromStorage(CURRENT_SESSION_STORAGE_KEY)

export const saveCurrentSessionToStorage = async (currentSession: CurrentSession): Promise<*> => {
  try {
    await saveToStorage(CURRENT_SESSION_STORAGE_KEY, currentSession.toJSON())
  } catch (err) {
    console.error('Error storing currentSession in localStorage', err)
  }
}
