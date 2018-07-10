// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { safeParamAddressSelector, type RouterProps } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'
import { TOKEN_REDUCER_ID } from '~/routes/tokens/store/reducer/tokens'
import { type Token } from '~/routes/tokens/store/model/token'

const balancesSelector = (state: GlobalState) => state[TOKEN_REDUCER_ID]

export const tokensSelector: Selector<GlobalState, RouterProps, Map<string, Token>> = createSelector(
  balancesSelector,
  safeParamAddressSelector,
  (balances: Map<string, Map<string, Token>>, address: string) => {
    if (!address) {
      return Map()
    }

    return balances.get(address) || Map()
  },
)

export const tokenListSelector = createSelector(
  tokensSelector,
  (balances: Map<string, Token>) => balances.toList(),
)

export const tokenAddressesSelector = createSelector(
  tokenListSelector,
  (balances: List<Token>) => {
    const addresses = List().withMutations(list =>
      balances.map(token => list.push(token.address)))

    return addresses
  },
)
