import { createSelector } from 'reselect'

import { TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'

export const tokensSelector = (state) => state[TOKEN_REDUCER_ID]

export const tokenListSelector = createSelector(tokensSelector, (tokens) => tokens.toList())

export const orderedTokenListSelector = createSelector(tokenListSelector, (tokens) =>
  tokens.sortBy((token) => token.get('symbol')),
)
