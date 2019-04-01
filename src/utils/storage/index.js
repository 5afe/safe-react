// @flow
import {
  ImmortalStorage, CookieStore, IndexedDbStore, LocalStorageStore, SessionStorageStore,
} from 'immortal-db'

const stores = [CookieStore, IndexedDbStore, LocalStorageStore, SessionStorageStore]
export const storage = new ImmortalStorage(stores)

export const load = async (key: string): Promise<*> => {
  try {
    const serializedState = await storage.get(key)
    if (serializedState === null || serializedState === undefined) {
      return undefined
    }

    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}
