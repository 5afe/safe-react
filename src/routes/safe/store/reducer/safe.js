// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import updateDailyLimit, { UPDATE_DAILY_LIMIT } from '~/routes/safe/store/actions/updateDailyLimit'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { saveSafes } from '~/utils/localStorage'
import { makeDailyLimit } from '~/routes/safe/store/model/dailyLimit'
import updateThreshold, { UPDATE_THRESHOLD } from '~/routes/safe/store/actions/updateThreshold'
import updateSafes, { UPDATE_SAFES } from '~/routes/safe/store/actions/updateSafes'
import updateSafe, { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'

export const SAFE_REDUCER_ID = 'safes'

export type State = Map<string, Safe>

/*
type Action<T> = {
  key: string,
  payload: T,
};

type AddSafeType = Action<SafeProps>

action: AddSafeType
*/

export default handleActions({
  [UPDATE_SAFE]: (state: State, action: ActionType<typeof updateSafe>): State =>
    state.set(action.payload.get('address'), action.payload),
  [UPDATE_SAFES]: (state: State, action: ActionType<typeof updateSafes>): State =>
    action.payload,
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
