import { List } from 'immutable'
import { createSelector } from 'reselect'

import { Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserAnOwner, sameAddress } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import { safeBalancesSelector, safeSelector } from 'src/logic/safe/store/selectors'
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
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeBalances, tokensList, ethAsToken): List<Token> => {
    const extendedTokens: Array<Token> = []

    safeBalances.forEach((safeBalance) => {
      const tokenAddress = safeBalance.tokenAddress

      if (!tokenAddress) {
        return
      }

      const baseToken = sameAddress(tokenAddress, ethAsToken?.address) ? ethAsToken : tokensList.get(tokenAddress)

      if (!baseToken) {
        return
      }

      const token = baseToken.set('balance', safeBalance)
      extendedTokens.push(token)
    })

    return List(extendedTokens)
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
