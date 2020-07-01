import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { ADD_TOKEN } from 'src/logic/tokens/store/actions/addToken'
import { ADD_TOKENS } from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken } from 'src/logic/tokens/store/model/token'

export const TOKEN_REDUCER_ID = 'tokens'

export default handleActions(
  {
    [ADD_TOKENS]: (state, action) => {
      const { tokens } = action.payload

      const newState = state.withMutations((map) => {
        tokens.forEach((token) => {
          map.set(token.address, token)
        })
      })

      return newState
    },
    [ADD_TOKEN]: (state, action) => {
      const { token } = action.payload
      const { address: tokenAddress } = token

      return state.set(tokenAddress, makeToken(token))
    },
  },
  Map(),
)
