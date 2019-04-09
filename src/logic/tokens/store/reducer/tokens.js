// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'
import { ADD_TOKEN } from '~/logic/tokens/store/actions/addToken'
import { REMOVE_TOKEN } from '~/logic/tokens/store/actions/removeToken'
import { ADD_TOKENS } from '~/logic/tokens/store/actions/saveTokens'
import { DISABLE_TOKEN } from '~/logic/tokens/store/actions/disableToken'
import { ENABLE_TOKEN } from '~/logic/tokens/store/actions/enableToken'

export const TOKEN_REDUCER_ID = 'tokens'

export type State = Map<string, Map<string, Token>>

export default handleActions<State, *>(
  {
    [ADD_TOKENS]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, tokens } = action.payload

      return state.update(safeAddress, (prevState: Map<string, Token>) => (prevState ? prevState.merge(tokens) : tokens))
    },
    [ADD_TOKEN]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, token } = action.payload
      const { address: tokenAddress } = token

      return state.setIn([safeAddress, tokenAddress], token)
    },
    [REMOVE_TOKEN]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, token } = action.payload
      const { address: tokenAddress } = token

      return state.removeIn([safeAddress, tokenAddress])
    },
    [DISABLE_TOKEN]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, token } = action.payload
      const { address: tokenAddress } = token

      return state.setIn([safeAddress, tokenAddress, 'status'], false)
    },
    [ENABLE_TOKEN]: (state: State, action: ActionType<Function>): State => {
      const { safeAddress, token } = action.payload
      const { address: tokenAddress } = token

      return state.setIn([safeAddress, tokenAddress, 'status'], true)
    },
  },
  Map(),
)
