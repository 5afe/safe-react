// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { safeParamAddressSelector, type RouterProps } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'
import { TOKEN_REDUCER_ID } from '~/routes/tokens/store/reducer/tokens'
import { type Token } from '~/routes/tokens/store/model/token'
import { calculateActiveErc20TokensFrom } from '~/utils/tokens'

const balancesSelector = (state: GlobalState) => state[TOKEN_REDUCER_ID]

export const tokensSelector: Selector<GlobalState, RouterProps, Map<string, Token>> = createSelector(
  balancesSelector,
  safeParamAddressSelector,
  (tokens: Map<string, Map<string, Token>>, address: string) => {
    if (!address) {
      return Map()
    }

    return tokens.get(address) || Map()
  },
)

export const tokenListSelector = createSelector(
  tokensSelector,
  (tokens: Map<string, Token>) => tokens.toList(),
)

export const activeTokensSelector = createSelector(
  tokenListSelector,
  (tokens: List<Token>) => tokens.filter((token: Token) => token.get('status')),
)

export const tokenAddressesSelector = createSelector(
  tokenListSelector,
  (balances: List<Token>) => {
    const addresses = List().withMutations(list =>
      balances.map(token => list.push(token.address)))

    return addresses
  },
)

export const activeTokenAddressesSelector = createSelector(
  tokenListSelector,
  (balances: List<Token>) => calculateActiveErc20TokensFrom(balances),
)
