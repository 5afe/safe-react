import { List, Map } from 'immutable'
import { createSelector } from 'reselect'

import { Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserAnOwner, sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import { safeActiveTokensSelector, safeBalancesSelector, safeSelector } from 'src/logic/safe/store/selectors'
import { SafeRecord } from 'src/logic/safe/store/models/safe'

export const grantedSelector = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: SafeRecord): boolean => isUserAnOwner(safe, userAccount),
)

const safeEthAsTokenSelector = createSelector(safeSelector, (safe?: SafeRecord): Token | undefined => {
  if (!safe) {
    return undefined
  }

  return getEthAsToken(safe.ethBalance)
})

export const extendedSafeTokensSelector = createSelector(
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens, balances, tokensList, ethAsToken): List<Token> => {
    const extendedTokens = Map<string, Token>().withMutations((map) => {
      safeTokens.forEach((tokenAddress) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances?.get(tokenAddress)

        if (baseToken) {
          const updatedBaseToken = baseToken.set('balance', tokenBalance || { tokenBalance: '0', fiatBalance: '0' })
          if (sameAddress(tokenAddress, ZERO_ADDRESS) || sameAddress(tokenAddress, ethAsToken?.address)) {
            map.set(tokenAddress, updatedBaseToken.set('logoUri', ethAsToken?.logoUri || baseToken.logoUri))
          } else {
            map.set(tokenAddress, updatedBaseToken)
          }
        }
      })
    })

    return extendedTokens.toList()
  },
)

export const safeKnownCoins = createSelector(
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens, nativeCoinAsToken): List<Token> => {
    if (nativeCoinAsToken) {
      return safeTokens.set(nativeCoinAsToken.address, nativeCoinAsToken).toList()
    }

    return safeTokens.toList()
  },
)
