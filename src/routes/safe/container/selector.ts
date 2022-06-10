import * as Sentry from '@sentry/react'
import { List } from 'immutable'
import { createSelector } from 'reselect'

import { Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserAnOwner, sameAddress } from 'src/logic/wallets/ethAddresses'
import { shouldSwitchWalletChain, userAccountSelector } from 'src/logic/wallets/store/selectors'

import { currentSafe, currentSafeBalances } from 'src/logic/safe/store/selectors'
import { SafeRecord } from 'src/logic/safe/store/models/safe'

export const grantedSelector = createSelector(
  userAccountSelector,
  currentSafe,
  shouldSwitchWalletChain,
  (userAccount: string, safe: SafeRecord, isWrongChain: boolean): boolean => {
    return isUserAnOwner(safe, userAccount) && !isWrongChain && !sameAddress(userAccount, safe.address)
  },
)

export const sameAddressAsSafeSelector = createSelector(
  userAccountSelector,
  currentSafe,
  (userAccount: string, safe: SafeRecord): boolean => sameAddress(userAccount, safe.address),
)

const safeEthAsTokenSelector = createSelector(currentSafe, (safe?: SafeRecord): Token | undefined => {
  if (!safe) {
    return undefined
  }

  return getEthAsToken(safe.ethBalance)
})

export const extendedSafeTokensSelector = createSelector(
  currentSafeBalances,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeBalances, tokensList, ethAsToken): List<Token> => {
    const extendedTokens: Array<Token> = []

    if (!Array.isArray(safeBalances)) {
      // We migrated from immutable Map to array in v3.5.0. Previously stored safes could be still using an object
      // to store balances. We add this check to avoid the app to break and refetch the information correctly
      Sentry.captureMessage(
        'There was an error loading `safeBalances` in `extendedSafeTokensSelector`, probably safe loaded prior to v3.5.0',
      )
      return List([])
    }

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
  (safeTokens, nativeCurrencyAsToken): List<Token> => {
    if (nativeCurrencyAsToken) {
      return safeTokens.set(nativeCurrencyAsToken.address, nativeCurrencyAsToken).toList()
    }

    return safeTokens.toList()
  },
)
