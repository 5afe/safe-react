import { createSelector } from 'reselect'

import { TOKEN_REDUCER_ID, TokenState } from 'src/logic/tokens/store/reducer/tokens'
import { AppReduxState } from 'src/store'

export const tokensSelector = (state: AppReduxState): TokenState => state[TOKEN_REDUCER_ID]

export const tokenListSelector = createSelector(tokensSelector, (tokens) => tokens.toList())

export const orderedTokenListSelector = createSelector(tokenListSelector, (tokens) =>
  tokens.sortBy((token) => token.get('symbol')),
)
