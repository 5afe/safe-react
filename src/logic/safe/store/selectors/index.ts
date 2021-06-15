import { List } from 'immutable'
import { matchPath } from 'react-router-dom'
import { createSelector } from 'reselect'

import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { SafesMap } from 'src/logic/safe/store/reducer/types/safe'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Overwrite } from 'src/types/helpers'

const safesState = (state: AppReduxState) => state[SAFE_REDUCER_ID]

export const safesAsMap = (state: AppReduxState): SafesMap => safesState(state).get('safes')

export const safesAsList = createSelector(safesAsMap, (safes): List<SafeRecord> => safes.toList())

export const defaultSafe = createSelector(safesState, (safeState) => safeState.get('defaultSafe'))

export const latestMasterContractVersion = createSelector(safesState, (safeState) =>
  safeState.get('latestMasterContractVersion'),
)

export const safeAddressFromUrl = (state: AppReduxState): string => {
  const match = matchPath<{ safeAddress: string }>(state.router.location.pathname, {
    path: `${SAFELIST_ADDRESS}/:safeAddress`,
  })

  if (match) {
    return checksumAddress(match.params.safeAddress).toString()
  }

  return ''
}

export const currentSafe = createSelector([safesAsMap, safeAddressFromUrl], (safes: SafesMap, address: string):
  | SafeRecord
  | undefined => safes.get(address))

const baseSafe = makeSafe()

export const safeFieldSelector = <K extends keyof SafeRecordProps>(field: K) => (
  safe: SafeRecord,
): SafeRecordProps[K] | undefined => (safe ? safe.get(field, baseSafe.get(field)) : undefined)

export const currentSafeEthBalance = createSelector(currentSafe, safeFieldSelector('ethBalance'))

export const currentSafeBalances = createSelector(currentSafe, safeFieldSelector('balances'))

export const currentSafeNeedsUpdate = createSelector(currentSafe, safeFieldSelector('needsUpdate'))

export const currentSafeCurrentVersion = createSelector(currentSafe, safeFieldSelector('currentVersion'))

export const currentSafeThreshold = createSelector(currentSafe, safeFieldSelector('threshold'))

export const currentSafeNonce = createSelector(currentSafe, safeFieldSelector('nonce'))

export const currentSafeOwners = createSelector(currentSafe, safeFieldSelector('owners'))

export const currentSafeModules = createSelector(currentSafe, safeFieldSelector('modules'))

export const currentSafeFeaturesEnabled = createSelector(currentSafe, safeFieldSelector('featuresEnabled'))

export const currentSafeSpendingLimits = createSelector(currentSafe, safeFieldSelector('spendingLimits'))

export const currentSafeTotalFiatBalance = createSelector(currentSafe, safeFieldSelector('totalFiatBalance'))

/*************************/
/* With AddressBook Data */
/*************************/
const baseSafeWithName = { ...baseSafe.toJS(), name: '' }

export type SafeRecordWithNames = Overwrite<SafeRecordProps, { owners: AddressBookEntry[] }> & { name: string }

export const safesWithNamesAsList = createSelector(
  [safesAsList, currentNetworkAddressBookAsMap],
  (safesList, addressBookMap): SafeRecordWithNames[] => {
    return safesList
      .map((safeRecord) => {
        const safe = safeRecord.toObject()
        const name = addressBookMap?.[safe.address]?.name ?? ''

        const owners = safe.owners.map((ownerAddress) => {
          return addressBookMap?.[ownerAddress] ?? makeAddressBookEntry({ address: ownerAddress, name: '' })
        })

        return { ...safe, name, owners }
      })
      .toJS()
  },
)

export const safesWithNamesAsMap = createSelector([safesWithNamesAsList], (safesList): {
  [address: string]: SafeRecordWithNames
} => {
  return safesList.reduce((acc, safe) => {
    acc[safe.address] = safe
    return acc
  }, {})
})

export const currentSafeWithNames = createSelector(
  [safesWithNamesAsMap, currentSafe],
  (safesMap, safe): SafeRecordWithNames => (safe ? safesMap[safe.address] : baseSafeWithName),
)
