import { Map, Set } from 'immutable'
import { handleActions } from 'redux-actions'

import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from 'src/logic/safe/store/actions/activateTokenForAllSafes'
import { ADD_SAFE, buildOwnersFrom } from 'src/logic/safe/store/actions/addSafe'
import { ADD_SAFE_OWNER } from 'src/logic/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/logic/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/logic/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from 'src/logic/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import makeSafe, { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SafeReducerMap } from 'src/routes/safe/store/reducer/types/safe'

export const SAFE_REDUCER_ID = 'safes'
export const DEFAULT_SAFE_INITIAL_STATE = 'NOT_ASKED'

export const buildSafe = (storedSafe: SafeRecordProps): SafeRecordProps => {
  const names = storedSafe.owners.map((owner) => owner.name)
  const addresses = storedSafe.owners.map((owner) => checksumAddress(owner.address))
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))
  const activeTokens = Set(storedSafe.activeTokens)
  const activeAssets = Set(storedSafe.activeAssets)
  const blacklistedTokens = Set(storedSafe.blacklistedTokens)
  const blacklistedAssets = Set(storedSafe.blacklistedAssets)
  const balances = Map(storedSafe.balances)

  return {
    ...storedSafe,
    owners,
    balances,
    activeTokens,
    blacklistedTokens,
    activeAssets,
    blacklistedAssets,
    latestIncomingTxBlock: 0,
    modules: null,
  }
}

export default handleActions(
  {
    [UPDATE_SAFE]: (state: SafeReducerMap, action) => {
      const safe = action.payload
      const safeAddress = safe.address

      return state.updateIn(
        ['safes', safeAddress],
        makeSafe({ name: 'LOADED SAFE', address: safeAddress }),
        (prevSafe) => {
          return prevSafe.withMutations((record) => {
            // Every property is updated individually to overcome the issue with nested data being overwritten
            if (safe.name) {
              record.set('name', safe.name)
            }

            if (safe.address) {
              record.set('address', safe.address)
            }

            if (safe.threshold) {
              record.set('threshold', safe.threshold)
            }

            if (safe.ethBalance) {
              record.set('ethBalance', safe.ethBalance)
            }

            if (safe.owners?.size) {
              record.update('owners', (current) => current.set(safe.owners))
            }

            if (safe.modules?.length) {
              record.update('modules', () => safe.modules)
            }

            if (safe.activeTokens?.size) {
              record.update('activeTokens', (current) => current.merge(safe.activeTokens))
            }

            if (safe.activeAssets?.size) {
              record.update('activeAssets', (current) => current.merge(safe.activeAssets))
            }

            if (safe.blacklistedTokens?.size) {
              record.update('blacklistedTokens', (current) => current.merge(safe.blacklistedTokens))
            }

            if (safe.blacklistedAssets?.size) {
              record.update('blacklistedAssets', (current) => current.merge(safe.blacklistedAssets))
            }

            if (safe.balances?.size) {
              record.update('balances', (current) => current.merge(safe.balances))
            }

            if (safe.nonce) {
              record.set('nonce', safe.nonce)
            }

            if (safe.latestIncomingTxBlock) {
              record.set('latestIncomingTxBlock', safe.latestIncomingTxBlock)
            }

            if (safe.recurringUser) {
              record.set('recurringUser', safe.recurringUser)
            }

            if (safe.currentVersion) {
              record.set('currentVersion', safe.currentVersion)
            }

            if (safe.needsUpdate !== undefined) {
              record.set('needsUpdate', safe.needsUpdate)
            }

            if (safe.featuresEnabled?.length) {
              record.update('featuresEnabled', () => safe.featuresEnabled)
            }
          })
        },
      )
    },
    [ACTIVATE_TOKEN_FOR_ALL_SAFES]: (state: SafeReducerMap, action) => {
      const tokenAddress = action.payload

      return state.withMutations((map) => {
        map
          .get('safes')
          .keySeq()
          .forEach((safeAddress) => {
            const safeActiveTokens = map.getIn(['safes', safeAddress, 'activeTokens'])
            const activeTokens = safeActiveTokens.add(tokenAddress)

            map.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.mergeDeep({ activeTokens }))
          })
      })
    },
    [ADD_SAFE]: (state: SafeReducerMap, action) => {
      const { safe } = action.payload

      // if you add a new Safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.hasIn(['safes', safe.address])) {
        return state
      }

      return state.setIn(['safes', safe.address], makeSafe(safe))
    },
    [REMOVE_SAFE]: (state: SafeReducerMap, action) => {
      const safeAddress = action.payload

      return state.deleteIn(['safes', safeAddress])
    },
    [ADD_SAFE_OWNER]: (state: SafeReducerMap, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [REMOVE_SAFE_OWNER]: (state: SafeReducerMap, action) => {
      const { ownerAddress, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
        }),
      )
    },
    [REPLACE_SAFE_OWNER]: (state: SafeReducerMap, action) => {
      const { oldOwnerAddress, ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners
            .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
            .push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [EDIT_SAFE_OWNER]: (state: SafeReducerMap, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
    [SET_DEFAULT_SAFE]: (state: SafeReducerMap, action) => state.set('defaultSafe', action.payload),
    [SET_LATEST_MASTER_CONTRACT_VERSION]: (state: SafeReducerMap, action) =>
      state.set('latestMasterContractVersion', action.payload),
  },
  Map({
    defaultSafe: DEFAULT_SAFE_INITIAL_STATE,
    safes: Map(),
    latestMasterContractVersion: '',
  }),
)
