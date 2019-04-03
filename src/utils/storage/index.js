// @flow
import {
  ImmortalStorage, CookieStore, IndexedDbStore, LocalStorageStore, SessionStorageStore,
} from 'immortal-db'

const stores = [CookieStore, IndexedDbStore, LocalStorageStore, SessionStorageStore]
export const storage = new ImmortalStorage(stores)

const PREFIX = 'v1'

export const loadFromStorage = async (key: string): Promise<*> => {
  try {
    const serializedState = await storage.get(`${PREFIX}__${key}`)
    if (serializedState === null || serializedState === undefined) {
      return undefined
    }

    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveInStorage = async (key: string, value: string): Promise<*> => {
  try {
    await storage.set(`${PREFIX}__${key}`, value)
  } catch (err) {
    console.error(`Failed to save ${key} in the storage:`, err)
  }
}
