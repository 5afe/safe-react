import { List } from 'immutable'
import { matchPath, RouteComponentProps } from 'react-router-dom'
import { createSelector } from 'reselect'
import { SAFELIST_ADDRESS, SAFE_PARAM_ADDRESS } from 'src/routes/routes'

import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { AppReduxState } from 'src/store'

import { checksumAddress } from 'src/utils/checksumAddress'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { SafesMap } from 'src/routes/safe/store/reducer/types/safe'
import { BalanceRecord } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

const safesStateSelector = (state: AppReduxState) => state[SAFE_REDUCER_ID]

export const safesMapSelector = (state: AppReduxState): SafesMap => safesStateSelector(state).get('safes')

export const safesListSelector = createSelector(safesMapSelector, (safes): List<SafeRecord> => safes.toList())

export const safesCountSelector = createSelector(safesMapSelector, (safes) => safes.size)

export const defaultSafeSelector = createSelector(safesStateSelector, (safeState) => safeState.get('defaultSafe'))

export const latestMasterContractVersionSelector = createSelector(safesStateSelector, (safeState) =>
  safeState.get('latestMasterContractVersion'),
)

export const safeParamAddressFromStateSelector = (state: AppReduxState): string => {
  const match = matchPath<{ safeAddress: string }>(state.router.location.pathname, {
    path: `${SAFELIST_ADDRESS}/:safeAddress`,
  })

  if (match) {
    return checksumAddress(match.params.safeAddress)
  }

  return ''
}

export const safeParamAddressSelector = (
  state: AppReduxState,
  props: RouteComponentProps<{ [SAFE_PARAM_ADDRESS]?: string }>,
): string => {
  const urlAdd = props.match.params[SAFE_PARAM_ADDRESS]
  return urlAdd ? checksumAddress(urlAdd) : ''
}

export const addressBookQueryParamsSelector = (state: AppReduxState): string | undefined => {
  const { location } = state.router

  if (location?.query) {
    const { entryAddress } = location.query
    return entryAddress
  }
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

export const safeBalancesSelector = createSelector(
  safeSelector,
  (safe): Array<BalanceRecord> => {
    if (!safe) {
      return []
    }

    return safe.balances
  },
)

const baseSafe = makeSafe()

export const safeFieldSelector = <K extends keyof SafeRecordProps>(field: K) => (
  safe: SafeRecord,
): SafeRecordProps[K] | undefined => (safe ? safe.get(field, baseSafe.get(field)) : undefined)

export const safeEthBalanceSelector = createSelector(safeSelector, safeFieldSelector('ethBalance'))

export const safeNeedsUpdateSelector = createSelector(safeSelector, safeFieldSelector('needsUpdate'))

export const safeCurrentVersionSelector = createSelector(safeSelector, safeFieldSelector('currentVersion'))

export const safeThresholdSelector = createSelector(safeSelector, safeFieldSelector('threshold'))

export const safeNonceSelector = createSelector(safeSelector, safeFieldSelector('nonce'))

export const safeOwnersSelector = createSelector(safeSelector, safeFieldSelector('owners'))

export const safeModulesSelector = createSelector(safeSelector, safeFieldSelector('modules'))

export const safeFeaturesEnabledSelector = createSelector(safeSelector, safeFieldSelector('featuresEnabled'))

export const safeSpendingLimitsSelector = createSelector(safeSelector, safeFieldSelector('spendingLimits'))

export const safeLoadedViaUrlSelector = createSelector(safeSelector, safeFieldSelector('loadedViaUrl'))

export const safeTotalFiatBalanceSelector = createSelector(safeSelector, (currentSafe) => {
  return currentSafe?.totalFiatBalance
})

export const safeOwnersWithAddressBookDataSelector = createSelector(
  [safeOwnersSelector, addressBookSelector, (_, chainId: ETHEREUM_NETWORK) => chainId],
  (owners, addressBook, chainId): AppReduxState['addressBook'] | undefined =>
    owners?.map((ownerAddress) => {
      const ownerInAddressBook = addressBook.find(
        (addressBookEntry) =>
          sameAddress(ownerAddress, addressBookEntry.address) && chainId === addressBookEntry.chainId,
      )

      if (ownerInAddressBook) {
        return ownerInAddressBook
      }

      // if there's no owner's data in the AB, we create an in-memory AB-like structure
      return makeAddressBookEntry({ address: ownerAddress })
    }),
)
