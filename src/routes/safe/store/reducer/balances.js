// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addBalance, { ADD_BALANCE } from '~/routes/safe/store/actions/addBalance'

export const BALANCE_REDUCER_ID = 'balances'

export type State = Map<string, string>

export default handleActions({
  [ADD_BALANCE]: (state: State, action: ActionType<typeof addBalance>): State =>
    state.set(action.payload.safeAddress, action.payload.funds),
}, Map())
