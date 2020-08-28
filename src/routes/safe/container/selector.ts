import { Map } from 'immutable'
import { createSelector } from 'reselect'

import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserOwner } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import { safeActiveTokensSelector, safeBalancesSelector, safeSelector } from 'src/routes/safe/store/selectors'

export const grantedSelector = createSelector(userAccountSelector, safeSelector, (userAccount, safe) =>
  isUserOwner(safe, userAccount),
)

const safeEthAsTokenSelector = createSelector(safeSelector, (safe) => {
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
  (safeTokens, balances, tokensList, ethAsToken) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((tokenAddress) => {
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
