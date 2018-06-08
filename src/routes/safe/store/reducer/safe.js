// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { saveSafes, setOwners } from '~/utils/localStorage'
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
    const safe: Safe = makeSafe(action.payload)
    setOwners(safe.get('address'), safe.get('owners'))

    const safes = state.set(action.payload.address, safe)
    saveSafes(safes.toJSON())
    return safes
  },
}, Map())
