import { List, Map, Set } from 'immutable'
import { RouteComponentProps } from 'react-router-dom'
import { createSelector } from 'reselect'
import { ModuleTxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadModuleTransactions'

import { SafeRecord } from 'src/logic/safe/store/models/safe'
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
import { TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/transactions'
import { tokenListSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_PARAM_ADDRESS } from 'src/routes/routes'
import {
  safeParamAddressFromStateSelector,
  safeSelector,
  safesMapSelector,
  safesStateSelector,
} from 'src/routes/safe/container/selector'
import { SafesMap } from 'src/routes/safe/store/reducer/types/safe'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

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

export const modulesTransactionsBySafeSelector = createSelector(
  moduleTransactionsSelector,
  safeParamAddressFromStateSelector,
  (moduleTransactions, safeAddress): ModuleTxServiceModel[] => {
    // no module tx for the current safe so far
    if (!moduleTransactions || !safeAddress || !moduleTransactions[safeAddress]) {
      return []
    }

    return moduleTransactions[safeAddress]
  },
)

export const safeModuleTransactionsSelector = createSelector(
  tokenListSelector,
  modulesTransactionsBySafeSelector,
  (tokens, safeModuleTransactions): SafeModuleTransaction[] => {
    return safeModuleTransactions.map((moduleTx) => {
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
