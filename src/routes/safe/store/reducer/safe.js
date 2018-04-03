// @flow
import { Map, List } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { loadSafes, saveSafes } from '~/utils/localStorage'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

const buildSafesFrom = (loadedSafes: Object): State => {
  const safes: State = Map()

  return safes.withMutations((map: State) => {
    Object.keys(loadedSafes).forEach((address) => {
      const safe = loadedSafes[address]
      safe.owners = List(safe.owners.map((owner => makeOwner(owner))))
      return map.set(address, makeSafe(safe))
    })
  })
}

export const defaultProps = (): State => {
  const storedSafes = loadSafes()

  return storedSafes ? buildSafesFrom(storedSafes) : Map()
}

/*
type Action<T> = {
  key: string,
  payload: T,
};

type AddSafeType = Action<SafeProps>

action: AddSafeType
*/

export default handleActions({
  [ADD_SAFE]: (state: State, action: ActionType<typeof addSafe>): State => {
    const safes = state.set(action.payload.address, makeSafe(action.payload))
    saveSafes(safes.toJSON())
    return safes
  },
}, defaultProps())
