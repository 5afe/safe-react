// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE, buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { saveSafes, setOwners, load, SAFES_KEY } from '~/utils/localStorage'
import updateSafe, { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

export const buildSafe = (storedSafe: SafeProps) => {
  const owners = buildOwnersFrom(
    storedSafe.owners.map((owner: OwnerProps) => owner.address),
    storedSafe.owners.map((owner: OwnerProps) => owner.name),
  )

  const safe: SafeProps = {
    address: storedSafe.address,
    name: storedSafe.name,
    threshold: storedSafe.threshold,
    owners,
  }

  return makeSafe(safe)
}

const buildSafesFrom = (loadedSafes: Object): Promise<Map<string, Safe>> => {
  const safes = Map()

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
  [UPDATE_SAFE]: (state: State, action: ActionType<typeof updateSafe>): State =>
    state.update(action.payload.get('address'), prevSafe =>
      (prevSafe.equals(action.payload) ? prevSafe : action.payload)),
  [ADD_SAFE]: (state: State, action: ActionType<typeof addSafe>): State => {
    const safe: Safe = makeSafe(action.payload)
    setOwners(safe.get('address'), safe.get('owners'))

    const safes = state.set(action.payload.address, safe)
    saveSafes(safes.toJSON())
    return safes
  },
}, Map())
