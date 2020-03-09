// @flow
import { List, Map } from 'immutable'
import { type Selector, createSelector } from 'reselect'

import { type Token } from '~/logic/tokens/store/model/token'
import { TOKEN_REDUCER_ID } from '~/logic/tokens/store/reducer/tokens'
import { type RouterProps } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'

export const tokensSelector = (state: GlobalState) => state[TOKEN_REDUCER_ID]

export const tokenListSelector: Selector<GlobalState, Map<string, Token>, List<Token>> = createSelector(
  tokensSelector,
  (tokens: Map<string, Token>) => tokens.toList(),
)

export const orderedTokenListSelector: Selector<
  GlobalState,
  RouterProps,
  List<Token>,
> = createSelector(tokenListSelector, (tokens: List<Token>) => tokens.sortBy((token: Token) => token.get('symbol')))
