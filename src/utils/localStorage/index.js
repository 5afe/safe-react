// @flow
import { List, Map } from 'immutable'
import { type Owner } from '~/routes/safe/store/model/owner'

export const SAFES_KEY = 'SAFES'
export const TX_KEY = 'TX'
export const OWNERS_KEY = 'OWNERS'

export const load = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) {
      return undefined
    }

    if (serializedState === undefined) {
      return undefined
    }

    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const getSafeName = (safeAddress: string) => {
  const safes = load(SAFES_KEY)
  if (!safes) {
    return undefined
  }
  const safe = safes[safeAddress]

  return safe ? safe.name : undefined
}

export const saveSafes = (safes: Object) => {
  try {
    const serializedState = JSON.stringify(safes)
    localStorage.setItem(SAFES_KEY, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing safe info in localstorage')
  }
}

export const setOwners = (safeAddress: string, owners: List<Owner>) => {
  try {
    const ownersAsMap = Map(owners.map((owner: Owner) => [owner.get('address').toLowerCase(), owner.get('name')]))
    const serializedState = JSON.stringify(ownersAsMap)
    localStorage.setItem(`${OWNERS_KEY}-${safeAddress}`, serializedState)
  } catch (err) {
    // eslint-disable-next-line
    console.log('Error storing owners in localstorage')
  }
}

export const getOwners = (safeAddress: string): Map<string, string> => {
  const data = load(`${OWNERS_KEY}-${safeAddress}`)

  return data ? Map(data) : Map()
}
