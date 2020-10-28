import { Map, Set, List } from 'immutable'
import { handleActions } from 'redux-actions'

import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from 'src/logic/safe/store/actions/activateTokenForAllSafes'
import { ADD_SAFE_OWNER } from 'src/logic/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/logic/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/logic/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from 'src/logic/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { UPDATE_TOKENS_LIST } from 'src/logic/safe/store/actions/updateTokensList'
import { UPDATE_ASSETS_LIST } from 'src/logic/safe/store/actions/updateAssetsList'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import makeSafe, { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SafeReducerMap } from 'src/routes/safe/store/reducer/types/safe'
import { ADD_OR_UPDATE_SAFE, buildOwnersFrom } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

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

const updateSafeProps = (prevSafe, safe) => {
  return prevSafe.withMutations((record) => {
    // Every property is updated individually to overcome the issue with nested data being overwritten
    const safeProperties = Object.keys(safe)

    // We check each safe property sent in action.payload
    safeProperties.forEach((key) => {
      if (safe[key] && typeof safe[key] === 'object') {
        if (safe[key].length >= 0 || Map.isMap(safe[key])) {
          // If type is array we replace it
          // If type is Immutable Map we replace it
          record.update(key, () => safe[key])
        } else if (safe[key].size >= 0) {
          // If type is Immutable List we replace current List
          // If type is Object we do a merge
          List.isList(safe[key])
            ? record.update(key, (current) => current.set(safe[key]))
            : record.update(key, (current) => current.merge(safe[key]))
        }
      } else {
        // By default we overwrite the value. This is for strings, numbers and unset values
        record.set(key, safe[key])
      }
    })
  })
}

export default handleActions(
  {
    [UPDATE_SAFE]: (state: SafeReducerMap, action) => {
      const safe = action.payload
      const safeAddress = safe.address

      return state.updateIn(
        ['safes', safeAddress],
        makeSafe({ name: safe?.name || 'LOADED SAFE', address: safeAddress }),
        (prevSafe) => updateSafeProps(prevSafe, safe),
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

    [ADD_OR_UPDATE_SAFE]: (state: SafeReducerMap, action) => {
      const { safe } = action.payload

      if (!state.hasIn(['safes', safe.address])) {
        return state.setIn(['safes', safe.address], makeSafe(safe))
      }

      return state.updateIn(
        ['safes', safe.address],
        makeSafe({ name: safe?.name || 'LOADED SAFE', address: safe.address }),
        (prevSafe) => updateSafeProps(prevSafe, safe),
      )
    },
    [REMOVE_SAFE]: (state: SafeReducerMap, action) => {
      const safeAddress = action.payload

      return state.deleteIn(['safes', safeAddress])
    },
    [ADD_SAFE_OWNER]: (state: SafeReducerMap, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      const addressFound = state
        .getIn(['safes', safeAddress])
        .owners.find((owner) => sameAddress(owner.address, ownerAddress))

      if (addressFound) {
        return state
      }

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
    [UPDATE_TOKENS_LIST]: (state: SafeReducerMap, action) => {
      // Only activeTokens or blackListedTokens is required
      const { safeAddress, activeTokens, blacklistedTokens } = action.payload

      const key = activeTokens ? 'activeTokens' : 'blacklistedTokens'
      const list = activeTokens ?? blacklistedTokens

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.set(key, list))
    },
    [UPDATE_ASSETS_LIST]: (state: SafeReducerMap, action) => {
      // Only activeAssets or blackListedAssets is required
      const { safeAddress, activeAssets, blacklistedAssets } = action.payload

      const key = activeAssets ? 'activeAssets' : 'blacklistedAssets'
      const list = activeAssets ?? blacklistedAssets

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.set(key, list))
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
