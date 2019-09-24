// @flow
import { List, Map } from 'immutable'
import { type Owner } from '~/routes/safe/store/models/owner'
import { loadFromStorage, saveToStorage, removeFromStorage } from '~/utils/storage'

export const SAFES_KEY = 'SAFES'
export const TX_KEY = 'TX'
export const OWNERS_KEY = 'OWNERS'
export const DEFAULT_SAFE_KEY = 'DEFAULT_SAFE'

export const getSafeName = async (safeAddress: string) => {
  const safes = await loadFromStorage(SAFES_KEY)
  if (!safes) {
    return undefined
  }
  const safe = safes[safeAddress]

  return safe ? safe.name : undefined
}

export const saveSafes = async (safes: Object) => {
  try {
    await saveToStorage(SAFES_KEY, safes)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing safe info in localstorage')
  }
}

export const setOwners = async (safeAddress: string, owners: List<Owner>) => {
  try {
    const ownersAsMap = Map(owners.map((owner: Owner) => [owner.address.toLowerCase(), owner.name]))
    await saveToStorage(`${OWNERS_KEY}-${safeAddress}`, ownersAsMap)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing owners in localstorage')
  }
}

export const getOwners = async (safeAddress: string): Promise<Map<string, string>> => {
  const data: Object = await loadFromStorage(`${OWNERS_KEY}-${safeAddress}`)

  return data ? Map(data) : Map()
}

export const getDefaultSafe = async (): Promise<string> => {
  const defaultSafe = await loadFromStorage(DEFAULT_SAFE_KEY)

  return defaultSafe || ''
}

export const saveDefaultSafe = async (safeAddress: string): Promise<void> => {
  try {
    await saveToStorage(DEFAULT_SAFE_KEY, safeAddress)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error saving default safe to storage: ', err)
  }
}

export const removeOwners = async (safeAddress: string): Promise<void> => {
  try {
    await removeFromStorage(`${OWNERS_KEY}-${safeAddress}`)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error removing owners from localstorage: ', err)
  }
}
