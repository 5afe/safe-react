// @flow
import { List, Map, Set } from 'immutable'
import { type Match, matchPath } from 'react-router-dom'
import { type OutputSelector, createSelector, createStructuredSelector } from 'reselect'

import { getWeb3 } from '~/logic/wallets/getWeb3'
import { SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS } from '~/routes/routes'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import {
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
  type CancelState as CancelTransactionsState,
} from '~/routes/safe/store/reducer/cancellationTransactions'
import {
  INCOMING_TRANSACTIONS_REDUCER_ID,
  type IncomingState as IncomingTransactionsState,
} from '~/routes/safe/store/reducer/incomingTransactions'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { TRANSACTIONS_REDUCER_ID, type State as TransactionsState } from '~/routes/safe/store/reducer/transactions'
import { type GlobalState } from '~/store/index'

export type RouterProps = {
  match: Match,
}

export type SafeProps = {
  safeAddress: string,
}

type TransactionProps = {
  transaction: Transaction,
}

const safesStateSelector = (state: GlobalState): Map<string, *> => state[SAFE_REDUCER_ID]

export const safesMapSelector = (state: GlobalState): Map<string, Safe> => state[SAFE_REDUCER_ID].get('safes')

export const safesListSelector: OutputSelector<GlobalState, {}, List<Safe>> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): List<Safe> => safes.toList(),
)

export const safesCountSelector: OutputSelector<GlobalState, {}, number> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): number => safes.size,
)

export const defaultSafeSelector: OutputSelector<GlobalState, {}, string> = createSelector(
  safesStateSelector,
  (safeState: Map<string, *>): string => safeState.get('defaultSafe'),
)

export const latestMasterContractVersionSelector: OutputSelector<
  GlobalState,
  {},
  string,
> = createSelector(safesStateSelector, (safeState: Map<string, *>): string =>
  safeState.get('latestMasterContractVersion'),
)

const transactionsSelector = (state: GlobalState): TransactionsState => state[TRANSACTIONS_REDUCER_ID]

const cancellationTransactionsSelector = (state: GlobalState): CancelTransactionsState =>
  state[CANCELLATION_TRANSACTIONS_REDUCER_ID]

const incomingTransactionsSelector = (state: GlobalState): IncomingTransactionsState =>
  state[INCOMING_TRANSACTIONS_REDUCER_ID]

const oneTransactionSelector = (state: GlobalState, props: TransactionProps) => props.transaction

export const safeParamAddressFromStateSelector = (state: GlobalState): string | null => {
  const match = matchPath(state.router.location.pathname, { path: `${SAFELIST_ADDRESS}/:safeAddress` })

  if (match) {
    const web3 = getWeb3()
    return web3.utils.toChecksumAddress(match.params.safeAddress)
  }

  return null
}

export const safeParamAddressSelector = (state: GlobalState, props: RouterProps) => {
  const urlAdd = props.match.params[SAFE_PARAM_ADDRESS]
  return urlAdd ? getWeb3().utils.toChecksumAddress(urlAdd) : ''
}

type TxSelectorType = OutputSelector<GlobalState, RouterProps, List<Transaction>>

export const safeTransactionsSelector: TxSelectorType = createSelector(
  transactionsSelector,
  safeParamAddressFromStateSelector,
  (transactions: TransactionsState, address: string): List<Transaction> => {
    if (!transactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return transactions.get(address) || List([])
  },
)

export const addressBookQueryParamsSelector = (state: GlobalState): string => {
  const { location } = state.router
  let entryAddressToEditOrCreateNew = null
  if (location && location.query) {
    const { entryAddress } = location.query
    entryAddressToEditOrCreateNew = entryAddress
  }
  return entryAddressToEditOrCreateNew
}

export const safeCancellationTransactionsSelector: TxSelectorType = createSelector(
  cancellationTransactionsSelector,
  safeParamAddressFromStateSelector,
  (cancellationTransactions: TransactionsState, address: string): List<Transaction> => {
    if (!cancellationTransactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return cancellationTransactions.get(address) || List([])
  },
)

type IncomingTxSelectorType = OutputSelector<GlobalState, RouterProps, List<IncomingTransaction>>

export const safeIncomingTransactionsSelector: IncomingTxSelectorType = createSelector(
  incomingTransactionsSelector,
  safeParamAddressFromStateSelector,
  (incomingTransactions: IncomingTransactionsState, address: string): List<IncomingTransaction> => {
    if (!incomingTransactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return incomingTransactions.get(address) || List([])
  },
)

export const confirmationsTransactionSelector: OutputSelector<GlobalState, TransactionProps, number> = createSelector(
  oneTransactionSelector,
  (tx: Transaction) => {
    if (!tx) {
      return 0
    }

    const confirmations: List<Confirmation> = tx.get('confirmations')
    if (!confirmations) {
      return 0
    }

    return confirmations.filter((confirmation: Confirmation) => confirmation.get('type') === 'confirmation').count()
  },
)

export type SafeSelectorProps = Safe | typeof undefined

export const safeSelector: OutputSelector<GlobalState, RouterProps, SafeSelectorProps> = createSelector(
  safesMapSelector,
  safeParamAddressFromStateSelector,
  (safes: Map<string, Safe>, address: string | null) => {
    if (!address) {
      return undefined
    }
    const checksumed = getWeb3().utils.toChecksumAddress(address)
    const safe = safes.get(checksumed)

    return safe
  },
)

export const safeActiveTokensSelector: OutputSelector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.activeTokens
  },
)

export const safeActiveAssetsSelector: OutputSelector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }
    return safe.activeAssets
  },
)

export const safeActiveAssetsListSelector: OutputSelector<GlobalState, RouterProps, List<string>> = createSelector(
  safeActiveAssetsSelector,
  (safeList: []) => {
    if (!safeList) {
      return Set([])
    }
    return Set(safeList)
  },
)

export const safeBlacklistedTokensSelector: OutputSelector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.blacklistedTokens
  },
)

export const safeBlacklistedAssetsSelector: OutputSelector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.blacklistedAssets
  },
)

export const safeActiveTokensSelectorBySafe = (safeAddress: string, safes: Map<string, Safe>): List<string> =>
  safes.get(safeAddress).get('activeTokens')

export const safeBlacklistedTokensSelectorBySafe = (safeAddress: string, safes: Map<string, Safe>): List<string> =>
  safes.get(safeAddress).get('blacklistedTokens')

export const safeActiveAssetsSelectorBySafe = (safeAddress: string, safes: Map<string, Safe>): List<string> =>
  safes.get(safeAddress).get('activeAssets')

export const safeBlacklistedAssetsSelectorBySafe = (safeAddress: string, safes: Map<string, Safe>): List<string> =>
  safes.get(safeAddress).get('blacklistedAssets')

export const safeBalancesSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.balances
  },
)

export const safeNameSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.name : undefined
  },
)

export const safeEthBalanceSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.ethBalance : undefined
  },
)

export const safeNeedsUpdateSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.needsUpdate : undefined
  },
)

export const safeCurrentVersionSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.currentVersion : undefined
  },
)

export const safeThresholdSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.threshold : undefined
  },
)

export const safeNonceSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.nonce : undefined
  },
)

export const safeOwnersSelector: OutputSelector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    return safe ? safe.owners : undefined
  },
)

export const safeFeaturesEnabledSelector: OutputSelector<
  GlobalState,
  RouterProps,
  Map<string, string>,
> = createSelector(safeSelector, (safe: Safe) => {
  return safe ? safe.featuresEnabled : undefined
})

export const getActiveTokensAddressesForAllSafes: OutputSelector<GlobalState, any, Set<string>> = createSelector(
  safesListSelector,
  (safes: List<Safe>) => {
    const addresses = Set().withMutations(set => {
      safes.forEach((safe: Safe) => {
        safe.activeTokens.forEach(tokenAddress => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)

export const getBlacklistedTokensAddressesForAllSafes: OutputSelector<GlobalState, any, Set<string>> = createSelector(
  safesListSelector,
  (safes: List<Safe>) => {
    const addresses = Set().withMutations(set => {
      safes.forEach((safe: Safe) => {
        safe.blacklistedTokens.forEach(tokenAddress => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  tokens: safeActiveTokensSelector,
  blacklistedTokens: safeBlacklistedTokensSelector,
})
