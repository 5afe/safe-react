// @flow
import { List, Map } from 'immutable'
import { type Selector, createSelector } from 'reselect'

import { type Token } from '~/logic/tokens/store/model/token'
import { tokensSelector } from '~/logic/tokens/store/selectors'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
import { isUserOwner } from '~/logic/wallets/ethAddresses'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { type Safe } from '~/routes/safe/store/models/safe'
import {
  type RouterProps,
  safeActiveTokensSelector,
  safeBalancesSelector,
  safeSelector,
} from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'

export const grantedSelector: Selector<GlobalState, RouterProps, boolean> = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: Safe | typeof undefined): boolean => isUserOwner(safe, userAccount),
)

const safeEthAsTokenSelector: Selector<GlobalState, RouterProps, ?Token> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return undefined
    }

    return getEthAsToken(safe.ethBalance)
  },
)

export const extendedSafeTokensSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens: List<string>, balances: Map<string, string>, tokensList: Map<string, Token>, ethAsToken: Token) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((tokenAddress: string) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances.get(tokenAddress)

        if (baseToken) {
          map.set(tokenAddress, baseToken.set('balance', tokenBalance || '0'))
        }
      })
    })

    if (ethAsToken) {
      return extendedTokens.set(ethAsToken.address, ethAsToken).toList()
    }

    return extendedTokens.toList()
  },
)
