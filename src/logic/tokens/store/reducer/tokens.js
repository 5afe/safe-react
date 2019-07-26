// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { type Token, makeToken } from '~/logic/tokens/store/model/token'
import { ADD_TOKEN } from '~/logic/tokens/store/actions/addToken'
import { REMOVE_TOKEN } from '~/logic/tokens/store/actions/removeToken'
import { ADD_TOKENS } from '~/logic/tokens/store/actions/saveTokens'

export const TOKEN_REDUCER_ID = 'tokens'

export type State = Map<string, Map<string, Token>>

export default handleActions<State, *>(
  {
    [ADD_TOKENS]: (state: State, action: ActionType<Function>): State => {
      const { tokens } = action.payload

      const newState = state.withMutations((map) => {
        tokens.forEach((token) => {
          map.set(token.address, token)
        })
      })

      return newState
    },
    [ADD_TOKEN]: (state: State, action: ActionType<Function>): State => {
      const { token } = action.payload
      const { address: tokenAddress } = token

      return state.set(tokenAddress, makeToken(token))
    },
    [REMOVE_TOKEN]: (state: State, action: ActionType<Function>): State => {
      const { token } = action.payload
      const { address: tokenAddress } = token

      return state.remove(tokenAddress)
    },
  },
  Map(),
)
