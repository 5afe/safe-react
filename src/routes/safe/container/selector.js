// @flow
import { List, Map } from 'immutable'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import {
  safeSelector,
  safeTokensSelector,
  type RouterProps,
  type SafeSelectorProps,
} from '~/routes/safe/store/selectors'
import { providerNameSelector, userAccountSelector, networkSelector } from '~/logic/wallets/store/selectors'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type GlobalState } from '~/store'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { orderedTokenListSelector, tokensSelector } from '~/logic/tokens/store/selectors'
import { type Token } from '~/logic/tokens/store/model/token'
import { safeParamAddressSelector } from '../store/selectors'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
  tokens: List<Token>,
  activeTokens: List<Token>,
  userAddress: string,
  network: string,
  safeUrl: string,
}

export const grantedSelector: Selector<GlobalState, RouterProps, boolean> = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: Safe | typeof undefined): boolean => {
    if (!safe) {
      return false
    }

    if (!userAccount) {
      return false
    }

    const owners: List<Owner> = safe.get('owners')
    if (!owners) {
      return false
    }

    return owners.find((owner: Owner) => sameAddress(owner.get('address'), userAccount)) !== undefined
  },
)

type UserToken = {
  address: string,
  balance: string,
}

const safeEthAsTokenSelector: Selector<GlobalState, RouterProps, ?Token> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return undefined
    }

    return getEthAsToken(safe.ethBalance)
  },
)

const extendedSafeTokensSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  safeTokensSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens: List<UserToken>, tokensList: Map<string, Token>, ethAsToken: Token) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((token: { address: string, balance: string }) => {
        const baseToken = tokensList.get(token.address)

        if (baseToken) {
          map.set(token.address, baseToken.set(token.balance))
        }
      })

      if (ethAsToken) {
        map.set(ethAsToken.address, ethAsToken)
      }
    })

    return extendedTokens.toList()
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  provider: providerNameSelector,
  tokens: orderedTokenListSelector,
  activeTokens: extendedSafeTokensSelector,
  granted: grantedSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  safeUrl: safeParamAddressSelector,
})
