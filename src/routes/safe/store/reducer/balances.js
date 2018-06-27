// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addBalances, { ADD_BALANCES } from '~/routes/safe/store/actions/addBalances'
import { type Balance } from '~/routes/safe/store/model/balance'

export const BALANCE_REDUCER_ID = 'balances'

export type State = Map<string, Map<string, Balance>>

export default handleActions({
  [ADD_BALANCES]: (state: State, action: ActionType<typeof addBalances>): State =>
    state.set(action.payload.safeAddress, action.payload.balances),
}, Map())
