import { createSelector } from 'reselect'

import {} from 'logic/tokens/store/model/token'
import { TOKEN_REDUCER_ID } from 'logic/tokens/store/reducer/tokens'
import {} from 'routes/safe/store/selectors'
import {} from 'store'

export const tokensSelector = (state) => state[TOKEN_REDUCER_ID]

export const tokenListSelector = createSelector(tokensSelector, (tokens) => tokens.toList())

export const orderedTokenListSelector = createSelector(tokenListSelector, (tokens) =>
  tokens.sortBy((token) => token.get('symbol')),
)
