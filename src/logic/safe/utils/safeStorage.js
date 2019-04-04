// @flow
import { type Owner } from '~/routes/safe/store/model/owner'
import { List, Map } from 'immutable'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

export const SAFES_KEY = 'SAFES'
export const TX_KEY = 'TX'
export const OWNERS_KEY = 'OWNERS'

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
    const ownersAsMap = Map(owners.map((owner: Owner) => [owner.get('address').toLowerCase(), owner.get('name')]))
    await saveToStorage(`${OWNERS_KEY}-${safeAddress}`, ownersAsMap)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing owners in localstorage')
  }
}

export const getOwners = async (safeAddress: string): Map<string, string> => {
  const data: Object = await loadFromStorage(`${OWNERS_KEY}-${safeAddress}`)

  return data ? Map(data) : Map()
}