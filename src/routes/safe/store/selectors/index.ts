import { List, Map, Set } from 'immutable'
import { matchPath, RouteComponentProps } from 'react-router-dom'
import { createSelector } from 'reselect'
import { SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS } from 'src/routes/routes'

import { CANCELLATION_TRANSACTIONS_REDUCER_ID } from 'src/routes/safe/store/reducer/cancellationTransactions'
import { INCOMING_TRANSACTIONS_REDUCER_ID } from 'src/routes/safe/store/reducer/incomingTransactions'
import { SAFE_REDUCER_ID, SafesMap } from 'src/routes/safe/store/reducer/safe'
import { TRANSACTIONS_REDUCER_ID } from 'src/routes/safe/store/reducer/transactions'
import { AppReduxState } from 'src/store'

import { checksumAddress } from 'src/utils/checksumAddress'
import makeSafe, { SafeRecord, SafeRecordProps } from '../models/safe'

const safesStateSelector = (state: AppReduxState) => state[SAFE_REDUCER_ID]

export const safesMapSelector = (state: AppReduxState): SafesMap => safesStateSelector(state).get('safes')

export const safesListSelector = createSelector(safesMapSelector, (safes): List<SafeRecord> => safes.toList())

export const safesCountSelector = createSelector(safesMapSelector, (safes) => safes.size)

export const defaultSafeSelector = createSelector(safesStateSelector, (safeState) => safeState.get('defaultSafe'))

export const latestMasterContractVersionSelector = createSelector(safesStateSelector, (safeState) =>
  safeState.get('latestMasterContractVersion'),
)

const transactionsSelector = (state: AppReduxState) => state[TRANSACTIONS_REDUCER_ID]

const cancellationTransactionsSelector = (state: AppReduxState) => state[CANCELLATION_TRANSACTIONS_REDUCER_ID]

const incomingTransactionsSelector = (state: AppReduxState) => state[INCOMING_TRANSACTIONS_REDUCER_ID]

export const safeParamAddressFromStateSelector = (state: AppReduxState): string | null => {
  const match = matchPath<{ safeAddress: string }>(state.router.location.pathname, {
    path: `${SAFELIST_ADDRESS}/:safeAddress`,
  })

  if (match) {
    return checksumAddress(match.params.safeAddress)
  }

  return null
}

export const safeParamAddressSelector = (
  state: AppReduxState,
  props: RouteComponentProps<{ [SAFE_PARAM_ADDRESS]?: string }>,
): string => {
  const urlAdd = props.match.params[SAFE_PARAM_ADDRESS]
  return urlAdd ? checksumAddress(urlAdd) : ''
}

export const safeTransactionsSelector = createSelector(
  transactionsSelector,
  safeParamAddressFromStateSelector,
  (transactions, address) => {
    if (!transactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return transactions.get(address, List([]))
  },
)

export const addressBookQueryParamsSelector = (state: AppReduxState): string | null => {
  const { location } = state.router
  let entryAddressToEditOrCreateNew = null
  if (location && location.query) {
    const { entryAddress } = location.query
    entryAddressToEditOrCreateNew = entryAddress
  }
  return entryAddressToEditOrCreateNew
}

export const safeCancellationTransactionsSelector = createSelector(
  cancellationTransactionsSelector,
  safeParamAddressFromStateSelector,
  (cancellationTransactions, address) => {
    if (!cancellationTransactions) {
      return Map()
    }

    if (!address) {
      return Map()
    }

    return cancellationTransactions.get(address, Map({}))
  },
)

export const safeIncomingTransactionsSelector = createSelector(
  incomingTransactionsSelector,
  safeParamAddressFromStateSelector,
  (incomingTransactions, address) => {
    if (!incomingTransactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return incomingTransactions.get(address, List([]))
  },
)

export const safeSelector = createSelector(
  safesMapSelector,
  safeParamAddressFromStateSelector,
  (safes: SafesMap, address: string): SafeRecord | undefined => {
    if (!address) {
      return undefined
    }
    const checksumed = checksumAddress(address)
    const safe = safes.get(checksumed)

    return safe
  },
)

export const safeActiveTokensSelector = createSelector(
  safeSelector,
  (safe): Set<string> => {
    if (!safe) {
      return Set()
    }

    return safe.activeTokens
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

export const safeBlacklistedTokensSelector = createSelector(safeSelector, (safe) => {
  if (!safe) {
    return List()
  }

  return safe.blacklistedTokens
})

export const safeBlacklistedAssetsSelector = createSelector(
  safeSelector,
  (safe): Set<string> => {
    if (!safe) {
      return Set()
    }

    return safe.blacklistedAssets
  },
)

export const safeActiveAssetsSelectorBySafe = (safeAddress: string, safes: SafesMap) =>
  safes.get(safeAddress).get('activeAssets')

export const safeBlacklistedAssetsSelectorBySafe = (safeAddress, safes) =>
  safes.get(safeAddress).get('blacklistedAssets')

export const safeBalancesSelector = createSelector(
  safeSelector,
  (safe): Map<string, string> => {
    if (!safe) {
      return Map()
    }

    return safe.balances
  },
)

const baseSafe = makeSafe()

export const safeFieldSelector = <K extends keyof SafeRecordProps>(field: K) => (
  safe: SafeRecord,
): SafeRecordProps[K] | null => (safe ? safe.get(field, baseSafe.get(field)) : null)

export const safeNameSelector = createSelector(safeSelector, safeFieldSelector('name'))

export const safeEthBalanceSelector = createSelector(safeSelector, safeFieldSelector('ethBalance'))

export const safeNeedsUpdateSelector = createSelector(safeSelector, safeFieldSelector('needsUpdate'))

export const safeCurrentVersionSelector = createSelector(safeSelector, safeFieldSelector('currentVersion'))

export const safeThresholdSelector = createSelector(safeSelector, safeFieldSelector('threshold'))

export const safeNonceSelector = createSelector(safeSelector, safeFieldSelector('nonce'))

export const safeOwnersSelector = createSelector(safeSelector, safeFieldSelector('owners'))

export const safeModulesSelector = createSelector(safeSelector, safeFieldSelector('modules'))

export const safeFeaturesEnabledSelector = createSelector(safeSelector, safeFieldSelector('featuresEnabled'))

export const getActiveTokensAddressesForAllSafes = createSelector(safesListSelector, (safes) => {
  const addresses = Set().withMutations((set) => {
    safes.forEach((safe) => {
      safe.activeTokens.forEach((tokenAddress) => {
        set.add(tokenAddress)
      })
    })
  })

  return addresses
})

export const getBlacklistedTokensAddressesForAllSafes = createSelector(safesListSelector, (safes) => {
  const addresses = Set().withMutations((set) => {
    safes.forEach((safe) => {
      safe.blacklistedTokens.forEach((tokenAddress) => {
        set.add(tokenAddress)
      })
    })
  })

  return addresses
})
