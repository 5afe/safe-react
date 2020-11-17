import { List, Map, Set } from 'immutable'
import { matchPath } from 'react-router-dom'
import { createSelector } from 'reselect'
import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'

import { Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserAnOwner } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { SafesMap } from 'src/routes/safe/store/reducer/types/safe'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'

export const safesStateSelector = (state: AppReduxState) => state[SAFE_REDUCER_ID]

export const safesMapSelector = (state: AppReduxState): SafesMap => safesStateSelector(state).get('safes')

export const safeParamAddressFromStateSelector = (state: AppReduxState): string => {
  const match = matchPath<{ safeAddress: string }>(state.router.location.pathname, {
    path: `${SAFELIST_ADDRESS}/:safeAddress`,
  })

  if (match) {
    return checksumAddress(match.params.safeAddress)
  }

  return ''
}

export const safeSelector = createSelector(
  safesMapSelector,
  safeParamAddressFromStateSelector,
  (safes: SafesMap, address: string): SafeRecord | undefined => {
    if (!address) {
      return undefined
    }
    const checksumed = checksumAddress(address)
    return safes.get(checksumed)
  },
)

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

export const safeActiveTokensSelector = createSelector(
  safeSelector,
  (safe): Set<string> => {
    if (!safe) {
      return Set()
    }

    return safe.activeTokens
  },
)

const baseSafe = makeSafe()
export const safeFieldSelector = <K extends keyof SafeRecordProps>(field: K) => (
  safe: SafeRecord,
): SafeRecordProps[K] | undefined => (safe ? safe.get(field, baseSafe.get(field)) : undefined)

export const safeNameSelector = createSelector(safeSelector, safeFieldSelector('name'))
export const safeEthBalanceSelector = createSelector(safeSelector, safeFieldSelector('ethBalance'))
export const safeBalancesSelector = createSelector(safeSelector, safeFieldSelector('balances'))
export const safeNeedsUpdateSelector = createSelector(safeSelector, safeFieldSelector('needsUpdate'))
export const safeCurrentVersionSelector = createSelector(safeSelector, safeFieldSelector('currentVersion'))
export const safeThresholdSelector = createSelector(safeSelector, safeFieldSelector('threshold'))
export const safeNonceSelector = createSelector(safeSelector, safeFieldSelector('nonce'))
export const safeOwnersSelector = createSelector(safeSelector, safeFieldSelector('owners'))
export const safeModulesSelector = createSelector(safeSelector, safeFieldSelector('modules'))
export const safeFeaturesEnabledSelector = createSelector(safeSelector, safeFieldSelector('featuresEnabled'))
export const safeOwnersAddressesListSelector = createSelector(
  safeOwnersSelector,
  (owners): List<string> => {
    if (!owners) {
      return List([])
    }

    return owners?.map(({ address }) => address)
  },
)
export const safeSpendingLimitsSelector = createSelector(safeSelector, safeFieldSelector('spendingLimits'))
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

export const safeActiveAssetsSelector = createSelector(
  safeSelector,
  (safe): Set<string> => {
    if (!safe) {
      return Set()
    }
    return safe.activeAssets
  },
)

export const safeActiveAssetsListSelector = createSelector(safeActiveAssetsSelector, (safeList) => {
  if (!safeList) {
    return Set([])
  }
  return Set(safeList)
})
