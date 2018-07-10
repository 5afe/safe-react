// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addTokens, { ADD_TOKENS } from '~/routes/tokens/store/actions/addTokens'
import { type Token } from '~/routes/tokens/store/model/token'
import disableToken, { DISABLE_TOKEN } from '~/routes/tokens/store/actions/disableToken'
import enableToken, { ENABLE_TOKEN } from '~/routes/tokens/store/actions/enableToken'

export const TOKEN_REDUCER_ID = 'tokens'

export type State = Map<string, Map<string, Token>>

export default handleActions({
  [ADD_TOKENS]: (state: State, action: ActionType<typeof addTokens>): State =>
    state.update(action.payload.safeAddress, (prevSafe: Map<string, Token>) => {
      if (!prevSafe) {
        return action.payload.tokens
      }

      return prevSafe.equals(action.payload.tokens) ? prevSafe : action.payload.tokens
    }),
  [DISABLE_TOKEN]: (state: State, action: ActionType<typeof disableToken>): State =>
    state.setIn([action.payload.safeAddress, action.payload.symbol, 'status'], false),
  [ENABLE_TOKEN]: (state: State, action: ActionType<typeof enableToken>): State =>
    state.setIn([action.payload.safeAddress, action.payload.symbol, 'status'], true),
}, Map())
