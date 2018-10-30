// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE, buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import { type Safe, type SafeProps, makeSafe } from '~/routes/safe/store/model/safe'
import { type OwnerProps } from '~/routes/safe/store/model/owner'
import { saveSafes, setOwners, load, SAFES_KEY } from '~/utils/localStorage'
import updateSafe, { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

export const buildSafe = (storedSafe: SafeProps) => {
  const names = storedSafe.owners.map((owner: OwnerProps) => owner.name)
  const addresses = storedSafe.owners.map((owner: OwnerProps) => owner.address)
  const owners = buildOwnersFrom(names.toIndexedSeq().toArray(), addresses.toIndexedSeq().toArray())

  const safe: SafeProps = {
    address: storedSafe.address,
    name: storedSafe.name,
    threshold: storedSafe.threshold,
    owners,
  }

  return makeSafe(safe)
}

const buildSafesFrom = (loadedSafes: Object): Map<string, Safe> => {
  const safes: Map<string, Safe> = Map()

  const keys = Object.keys(loadedSafes)
  try {
    const safeRecords = keys.map((address: string) => buildSafe(loadedSafes[address]))

    return safes.withMutations(async (map) => {
      safeRecords.forEach((safe: Safe) => map.set(safe.get('address'), safe))
    })
  } catch (err) {
    // eslint-disable-next-line
    console.log("Error while fetching safes information")

    return Map()
  }
}

export const safesInitialState = (): State => {
  const storedSafes = load(SAFES_KEY)
  const safes = storedSafes ? buildSafesFrom(storedSafes) : Map()

  return safes
}


export default handleActions({
  [UPDATE_SAFE]: (state: State, action: ActionType<typeof updateSafe>): State => {
    const safe = action.payload
    const safeAddress = safe.get('address')

    const hasSafe = !!state.get(safeAddress)
    if (hasSafe) {
      return state.update(safeAddress, prevSafe =>
        (prevSafe.equals(safe) ? prevSafe : safe))
    }

    return state.set(safeAddress, safe)
  },
  [ADD_SAFE]: (state: State, action: ActionType<typeof addSafe>): State => {
    const safe: Safe = makeSafe(action.payload)
    setOwners(safe.get('address'), safe.get('owners'))

    const safes = state.set(action.payload.address, safe)
    saveSafes(safes.toJSON())
    return safes
  },
}, Map())
