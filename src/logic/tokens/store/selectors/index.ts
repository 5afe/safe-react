import { Map } from 'immutable'
import { createSelector } from 'reselect'

import { TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'
import { Token } from '../model/token'

export const tokensSelector = (state: Map<string, unknown>): Map<string, Token> => state[TOKEN_REDUCER_ID]

export const tokenListSelector = createSelector(tokensSelector, (tokens) => tokens.toList())

export const orderedTokenListSelector = createSelector(tokenListSelector, (tokens) =>
  tokens.sortBy((token) => token.get('symbol')),
)
