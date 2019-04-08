// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { safeParamAddressSelector, type RouterProps } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'
import { TOKEN_REDUCER_ID } from '~/logic/tokens/store/reducer/tokens'
import { type Token } from '~/logic/tokens/store/model/token'

const tokensStateSelector = (state: GlobalState) => state[TOKEN_REDUCER_ID]

export const tokensSelector: Selector<GlobalState, RouterProps, Map<string, Token>> = createSelector(
  tokensStateSelector,
  safeParamAddressSelector,
  (tokens: Map<string, Map<string, Token>>, address: string) => {
    if (!address) {
      return Map()
    }

    return tokens.get(address) || Map()
  },
)

export const tokenListSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  tokensSelector,
  (tokens: Map<string, Token>) => tokens.toList(),
)

export const activeTokensSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  tokenListSelector,
  (tokens: List<Token>) => tokens.filter((token: Token) => token.get('status')),
)

export const orderedTokenListSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  tokenListSelector,
  (tokens: List<Token>) => tokens.sortBy((token: Token) => token.get('symbol')),
)

export const tokenAddressesSelector: Selector<GlobalState, RouterProps, List<string>> = createSelector(
  tokenListSelector,
  (tokens: List<Token>) => {
    const addresses = List().withMutations(list => tokens.map(token => list.push(token.address)))

    return addresses
  },
)

export const activeTokenAdressesSelector: Selector<GlobalState, RouterProps, List<string>> = createSelector(
  activeTokensSelector,
  (tokens: List<Token>) => {
    const addresses = List().withMutations(list => tokens.map(token => list.push(token.address)))

    return addresses
  },
)
