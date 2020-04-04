// 
import { List, Map, Set } from 'immutable'
import { matchPath } from 'react-router-dom'
import { createSelector, createStructuredSelector } from 'reselect'

import { getWeb3 } from 'logic/wallets/getWeb3'
import { SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS } from 'routes/routes'
import { } from 'routes/safe/store/models/confirmation'
import { } from 'routes/safe/store/models/safe'
import { } from 'routes/safe/store/models/transaction'
import {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
} from 'routes/safe/store/reducer/cancellationTransactions'
import {
  INCOMING_TRANSACTIONS_REDUCER_ID,
} from 'routes/safe/store/reducer/incomingTransactions'
import { SAFE_REDUCER_ID } from 'routes/safe/store/reducer/safe'
import { TRANSACTIONS_REDUCER_ID, } from 'routes/safe/store/reducer/transactions'
import { } from 'store/index'




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

const oneTransactionSelector = (state, props) => props.transaction

export const safeParamAddressSelector = (state, props) => {
  const urlAdd = props.match.params[SAFE_PARAM_ADDRESS]
  return urlAdd ? getWeb3().utils.toChecksumAddress(urlAdd) : ''
}


export const safeTransactionsSelector = createSelector(
  transactionsSelector,
  safeParamAddressSelector,
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
  safeParamAddressSelector,
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

export const safeParamAddressFromStateSelector = (state) => {
  const match = matchPath(state.router.location.pathname, { path: `${SAFELIST_ADDRESS}/:safeAddress` })

  if (match) {
    const web3 = getWeb3()
    return web3.utils.toChecksumAddress(match.params.safeAddress)
  }

  return null
}


export const safeIncomingTransactionsSelector = createSelector(
  incomingTransactionsSelector,
  safeParamAddressSelector,
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

export const confirmationsTransactionSelector = createSelector(
  oneTransactionSelector,
  (tx) => {
    if (!tx) {
      return 0
    }

    const confirmations = tx.get('confirmations')
    if (!confirmations) {
      return 0
    }

    return confirmations.filter((confirmation) => confirmation.get('type') === 'confirmation').count()
  },
)


export const safeSelector = createSelector(
  safesMapSelector,
  safeParamAddressFromStateSelector,
  (safes, address) => {
    if (!address) {
      return undefined
    }
    const checksumed = getWeb3().utils.toChecksumAddress(address)
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

export const safeActiveTokensSelectorBySafe = (safeAddress, safes) =>
  safes.get(safeAddress).get('activeTokens')

export const safeBlacklistedTokensSelectorBySafe = (safeAddress, safes) =>
  safes.get(safeAddress).get('blacklistedTokens')

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

export default createStructuredSelector({
  safe: safeSelector,
  tokens: safeActiveTokensSelector,
  blacklistedTokens: safeBlacklistedTokensSelector,
})
