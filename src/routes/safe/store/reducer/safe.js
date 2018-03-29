// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addSafe, { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'

export const REDUCER_ID = 'safes'

type State = Map<string, Safe>

const defaultProps: State = Map()

/*
type Action<T> = {
  key: string,
  payload: T,
};

type AddSafeType = Action<SafeProps>

action: AddSafeType
*/

export default handleActions({
  [ADD_SAFE]: (state: State, action: ActionType<typeof addSafe>): State =>
    state.set(action.payload.address, makeSafe(action.payload)),
}, defaultProps)
