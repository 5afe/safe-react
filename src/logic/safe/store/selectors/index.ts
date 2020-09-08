import { List, Map, Set } from 'immutable'
import { matchPath, RouteComponentProps } from 'react-router-dom'
import { createSelector } from 'reselect'

import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import {
  SafeModuleTransaction,
  TransactionStatus,
  TransactionTypes,
} from 'src/logic/safe/store/models/types/transaction'
import {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
  CancellationTransactions,
} from 'src/logic/safe/store/reducer/cancellationTransactions'
import { INCOMING_TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/incomingTransactions'
import { MODULE_TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/moduleTransactions'
import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/transactions'
import { tokenListSelector } from 'src/logic/tokens/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_PARAM_ADDRESS, SAFELIST_ADDRESS } from 'src/routes/routes'
import { SafesMap } from 'src/routes/safe/store/reducer/types/safe'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'

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

const moduleTransactionsSelector = (state: AppReduxState) => state[MODULE_TRANSACTIONS_REDUCER_ID]

export const safeParamAddressFromStateSelector = (state: AppReduxState): string | undefined => {
  const match = matchPath<{ safeAddress: string }>(state.router.location.pathname, {
    path: `${SAFELIST_ADDRESS}/:safeAddress`,
  })

  if (match) {
    return checksumAddress(match.params.safeAddress)
  }

  return undefined
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
  (cancellationTransactions, address): CancellationTransactions => {
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

export const safeModuleTransactionsSelector = createSelector(
  tokenListSelector,
  moduleTransactionsSelector,
  safeParamAddressFromStateSelector,
  (tokens, moduleTransactions, safeAddress): SafeModuleTransaction[] => {
    // no module tx for the current safe so far
    if (!moduleTransactions || !safeAddress || !moduleTransactions[safeAddress]) {
      return []
    }

    return moduleTransactions[safeAddress]?.map((moduleTx) => {
      // if not spendingLimit module tx, then it's an generic module tx
      const type = sameAddress(moduleTx.module, SPENDING_LIMIT_MODULE_ADDRESS)
        ? TransactionTypes.SPENDING_LIMIT
        : TransactionTypes.MODULE

      // TODO: this is strictly attached to Spending Limit Module.
      //  This has to be moved nearest the module info rendering.
      // add token info to the model, so data can be properly displayed in the UI
      let tokenInfo
      if (type === TransactionTypes.SPENDING_LIMIT) {
        if (moduleTx.data) {
          // if `data` is defined, then it's a token transfer
          tokenInfo = tokens.find(({ address }) => sameAddress(address, moduleTx.to))
        } else {
          // if `data` is not defined, then it's an ETH transfer
          // ETH does not exist in the list of tokens, so we recreate the record here
          tokenInfo = getEthAsToken(0)
        }
      }

      return {
        ...moduleTx,
        safeTxHash: moduleTx.transactionHash,
        executionTxHash: moduleTx.transactionHash,
        status: TransactionStatus.SUCCESS,
        tokenInfo,
        type,
      }
    })
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
    return safes.get(checksumed)
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

export const safeBlacklistedTokensSelector = createSelector(
  safeSelector,
  (safe): Set<string> => {
    if (!safe) {
      return Set()
    }

    return safe.blacklistedTokens
  },
)

export const safeBlacklistedAssetsSelector = createSelector(
  safeSelector,
  (safe): Set<string> => {
    if (!safe) {
      return Set()
    }

    return safe.blacklistedAssets
  },
)

export const safeActiveAssetsSelectorBySafe = (safeAddress: string, safes: SafesMap): Set<string> =>
  safes.get(safeAddress)?.get('activeAssets') || Set()

export const safeBlacklistedAssetsSelectorBySafe = (safeAddress: string, safes: SafesMap): Set<string> =>
  safes.get(safeAddress)?.get('blacklistedAssets') || Set()

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

export const safeSpendingLimitsSelector = createSelector(safeSelector, safeFieldSelector('spendingLimits'))

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
