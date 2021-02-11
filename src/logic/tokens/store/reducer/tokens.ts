import { List, Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { ADD_TOKEN } from 'src/logic/tokens/store/actions/addToken'
import { ADD_TOKENS } from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { AppReduxState } from 'src/store'

export const TOKEN_REDUCER_ID = 'tokens'

export type TokenState = Map<string, Token>

type TokensPayload = { tokens: List<Token> }
type TokenPayload = { token: Token }
type Payloads = TokensPayload | TokenPayload

export default handleActions<AppReduxState['tokens'], Payloads>(
  {
    [ADD_TOKENS]: (state: TokenState, action: Action<TokensPayload>) => {
      const { tokens } = action.payload

      return state.withMutations((map) => {
        tokens.forEach((token: Token) => {
          map.set(token.address, token)
        })
      })
    },
    [ADD_TOKEN]: (state: TokenState, action: Action<TokenPayload>) => {
      const { token } = action.payload
      const { address: tokenAddress } = token

      return state.set(tokenAddress, makeToken(token))
    },
  },
  Map(),
)
