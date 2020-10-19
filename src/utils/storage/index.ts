import { ImmortalStorage, IndexedDbStore, LocalStorageStore } from 'immortal-db'

import { getNetworkName } from 'src/config'

// Don't use sessionStorage and cookieStorage
// https://github.com/gruns/ImmortalDB/issues/22
// https://github.com/gruns/ImmortalDB/issues/6
const stores = [IndexedDbStore, LocalStorageStore]
export const storage = new ImmortalStorage(stores)

const PREFIX = `v2_${getNetworkName()}`

export const loadFromStorage = async <T = unknown>(key: string): Promise<T | undefined> => {
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

export const saveToStorage = async <T = unknown>(key: string, value: T): Promise<void> => {
  try {
    const stringifiedValue = JSON.stringify(value)
    await storage.set(`${PREFIX}__${key}`, stringifiedValue)
  } catch (err) {
    console.error(`Failed to save ${key} in the storage:`, err)
  }
}

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await storage.remove(`${PREFIX}__${key}`)
  } catch (err) {
    console.error(`Failed to remove ${key} from the storage:`, err)
  }
}
