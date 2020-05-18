import { List, Set } from 'immutable'
import { matchPath } from 'react-router-dom'
import { createSelector } from 'reselect'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS } from 'src/routes/routes'
import { } from 'src/routes/safe/store/models/safe'
import { } from 'src/routes/safe/store/models/transaction'
import {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
} from 'src/routes/safe/store/reducer/cancellationTransactions'
import {
  INCOMING_TRANSACTIONS_REDUCER_ID,
} from 'src/routes/safe/store/reducer/incomingTransactions'
import { SAFE_REDUCER_ID } from 'src/routes/safe/store/reducer/safe'
import { TRANSACTIONS_REDUCER_ID, } from 'src/routes/safe/store/reducer/transactions'
import { } from 'src/store/index'
import { checksumAddress } from 'src/utils/checksumAddress'



const safesStateSelector = (state) => state[SAFE_REDUCER_ID]

export const safesMapSelector = (state) => state[SAFE_REDUCER_ID].get('safes')

export const safesListSelector = createSelector(
  safesMapSelector,
  (safes) => safes.toList(),
)

export const safesCountSelector = createSelector(
  safesMapSelector,
  (safes) => safes.size,
)

export const defaultSafeSelector = createSelector(
  safesStateSelector,
  (safeState) => safeState.get('defaultSafe'),
)

export const latestMasterContractVersionSelector = createSelector(safesStateSelector, (safeState) =>
  safeState.get('latestMasterContractVersion'),
)

const transactionsSelector = (state) => state[TRANSACTIONS_REDUCER_ID]

const cancellationTransactionsSelector = (state) =>
  state[CANCELLATION_TRANSACTIONS_REDUCER_ID]

const incomingTransactionsSelector = (state) =>
  state[INCOMING_TRANSACTIONS_REDUCER_ID]

export const safeParamAddressFromStateSelector = (state) => {
  const match = matchPath(state.router.location.pathname, { path: `${SAFELIST_ADDRESS}/:safeAddress` })

  if (match) {
    const web3 = getWeb3()
    return web3.utils.toChecksumAddress(match.params.safeAddress)
  }

  return null
}

export const safeParamAddressSelector = (state, props) => {
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

    return transactions.get(address) || List([])
  },
)

export const addressBookQueryParamsSelector = (state) => {
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
      return List([])
    }

    if (!address) {
      return List([])
    }

    return cancellationTransactions.get(address) || List([])
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

    return incomingTransactions.get(address) || List([])
  },
)


export const safeSelector = createSelector(
  safesMapSelector,
  safeParamAddressFromStateSelector,
  (safes, address) => {
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
  (safe) => {
    if (!safe) {
      return List()
    }

    return safe.activeTokens
  },
)

export const safeActiveAssetsSelector = createSelector(
  safeSelector,
  (safe) => {
    if (!safe) {
      return List()
    }
    return safe.activeAssets
  },
)

export const safeActiveAssetsListSelector = createSelector(
  safeActiveAssetsSelector,
  (safeList) => {
    if (!safeList) {
      return Set([])
    }
    return Set(safeList)
  },
)

export const safeBlacklistedTokensSelector = createSelector(
  safeSelector,
  (safe) => {
    if (!safe) {
      return List()
    }

    return safe.blacklistedTokens
  },
)

export const safeBlacklistedAssetsSelector = createSelector(
  safeSelector,
  (safe) => {
    if (!safe) {
      return List()
    }

    return safe.blacklistedAssets
  },
)

export const safeActiveAssetsSelectorBySafe = (safeAddress, safes) =>
  safes.get(safeAddress).get('activeAssets')

export const safeBlacklistedAssetsSelectorBySafe = (safeAddress, safes) =>
  safes.get(safeAddress).get('blacklistedAssets')

export const safeBalancesSelector = createSelector(
  safeSelector,
  (safe) => {
    if (!safe) {
      return List()
    }

    return safe.balances
  },
)

export const safeNameSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.name : undefined
  },
)

export const safeEthBalanceSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.ethBalance : undefined
  },
)

export const safeNeedsUpdateSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.needsUpdate : undefined
  },
)

export const safeCurrentVersionSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.currentVersion : undefined
  },
)

export const safeThresholdSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.threshold : undefined
  },
)

export const safeNonceSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.nonce : undefined
  },
)

export const safeOwnersSelector = createSelector(
  safeSelector,
  (safe) => {
    return safe ? safe.owners : undefined
  },
)

export const safeFeaturesEnabledSelector = createSelector(safeSelector, (safe) => {
  return safe ? safe.featuresEnabled : undefined
})

export const getActiveTokensAddressesForAllSafes = createSelector(
  safesListSelector,
  (safes) => {
    const addresses = Set().withMutations((set) => {
      safes.forEach((safe) => {
        safe.activeTokens.forEach((tokenAddress) => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)

export const getBlacklistedTokensAddressesForAllSafes = createSelector(
  safesListSelector,
  (safes) => {
    const addresses = Set().withMutations((set) => {
      safes.forEach((safe) => {
        safe.blacklistedTokens.forEach((tokenAddress) => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)
