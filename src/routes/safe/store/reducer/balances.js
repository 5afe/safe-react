// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addBalances, { ADD_BALANCES } from '~/routes/safe/store/actions/addBalances'
import { type Balance } from '~/routes/safe/store/model/balance'

export const BALANCE_REDUCER_ID = 'balances'

export type State = Map<string, Map<string, Balance>>

export default handleActions({
  [ADD_BALANCES]: (state: State, action: ActionType<typeof addBalances>): State =>
    state.update(action.payload.safeAddress, (prevSafe: Map<string, Balance>) => {
      if (!prevSafe) {
        return action.payload.balances
      }

      return prevSafe.equals(action.payload.balances) ? prevSafe : action.payload.balances
    }),
}, Map())
