// @flow
import { Map, List } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import updateDailyLimit, { UPDATE_DAILY_LIMIT } from '~/routes/safe/store/actions/updateDailyLimit'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { load, saveSafes, SAFES_KEY } from '~/utils/localStorage'
import { makeDailyLimit } from '~/routes/safe/store/model/dailyLimit'
import updateThreshold, { UPDATE_THRESHOLD } from '~/routes/safe/store/actions/updateThreshold'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

const buildSafesFrom = (loadedSafes: Object): State => {
  const safes: State = Map()

  return safes.withMutations((map: State) => {
    Object.keys(loadedSafes).forEach((address) => {
      const safe = loadedSafes[address]
      safe.owners = List(safe.owners.map((owner => makeOwner(owner))))
      safe.dailyLimit = makeDailyLimit({ value: safe.dailyLimit.value, spentToday: safe.dailyLimit.spentToday })
      return map.set(address, makeSafe(safe))
    })
  })
}

export const safeInitialState = (): State => {
  const storedSafes = load(SAFES_KEY)

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
  [UPDATE_DAILY_LIMIT]: (state: State, action: ActionType<typeof updateDailyLimit>): State =>
    state.updateIn([action.payload.safeAddress, 'dailyLimit'], () => makeDailyLimit(action.payload.dailyLimit)),
  [UPDATE_THRESHOLD]: (state: State, action: ActionType<typeof updateThreshold>): State =>
    state.updateIn([action.payload.safeAddress, 'threshold'], () => action.payload.threshold),
}, Map())
