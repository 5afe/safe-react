// @flow
import {
  ImmortalStorage, IndexedDbStore, LocalStorageStore,
} from 'immortal-db'

// Don't use sessionStorage and cookieStorage
// https://github.com/gruns/ImmortalDB/issues/22
// https://github.com/gruns/ImmortalDB/issues/6
const stores = [IndexedDbStore, LocalStorageStore]
export const storage = new ImmortalStorage(stores)

const PREFIX = 'v1'

export const loadFromStorage = async (key: string): Promise<*> => {
  try {
    const stringifiedValue = await storage.get(`${PREFIX}__${key}`)
    if (stringifiedValue === null || stringifiedValue === undefined) {
      return undefined
    }

    return JSON.parse(stringifiedValue)
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err)
    return undefined
  }
}

export const saveToStorage = async (key: string, value: *): Promise<*> => {
  try {
    const stringifiedValue = JSON.stringify(value)
    await storage.set(`${PREFIX}__${key}`, stringifiedValue)
  } catch (err) {
    console.error(`Failed to save ${key} in the storage:`, err)
  }
}
