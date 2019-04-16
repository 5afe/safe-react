// @flow
import { List, Map } from 'immutable'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import {
  safeSelector,
  safeActiveTokensSelector,
  safeBalancesSelector,
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
import { type TokenBalance } from '~/routes/safe/store/models/tokenBalance'
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
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens: List<string>, balances: List<TokenBalance>, tokensList: Map<string, Token>, ethAsToken: Token) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((tokenAddress: string) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances.find(tknBalance => tknBalance.address === tokenAddress)

        if (baseToken) {
          map.set(tokenAddress, baseToken.set('balance', tokenBalance ? tokenBalance.balance : '0'))
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
