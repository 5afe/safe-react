import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_TOKEN } from 'src/logic/tokens/store/actions/addToken'
import { ADD_TOKENS } from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'

export const TOKEN_REDUCER_ID = 'tokens'

export type TokenState = Map<string, Token>

export default handleActions(
  {
    [ADD_TOKENS]: (state: TokenState, action) => {
      const { tokens } = action.payload

      return state.withMutations((map) => {
        tokens.forEach((token: Token) => {
          map.set(token.address, token)
        })
      })
    },
    [ADD_TOKEN]: (state: TokenState, action) => {
      const { token } = action.payload
      const { address: tokenAddress } = token

      return state.set(tokenAddress, makeToken(token))
    },
  },
  Map(),
)
