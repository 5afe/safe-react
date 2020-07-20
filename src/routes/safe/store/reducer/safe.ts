import { Map, Set } from 'immutable'
import { handleActions } from 'redux-actions'

import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from 'src/routes/safe/store/actions/activateTokenForAllSafes'
import { ADD_SAFE, buildOwnersFrom } from 'src/routes/safe/store/actions/addSafe'
import { ADD_SAFE_OWNER } from 'src/routes/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/routes/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/routes/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/routes/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/routes/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/routes/safe/store/actions/setDefaultSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from 'src/routes/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from 'src/routes/safe/store/actions/updateSafe'
import { makeOwner } from 'src/routes/safe/store/models/owner'
import makeSafe from 'src/routes/safe/store/models/safe'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SafeReducerMap } from './types/safe'
import { ADD_SAFE_MODULES } from 'src/routes/safe/store/actions/addSafeModules'

export const SAFE_REDUCER_ID = 'safes'
export const DEFAULT_SAFE_INITIAL_STATE = 'NOT_ASKED'

export const buildSafe = (storedSafe) => {
  const names = storedSafe.owners.map((owner) => owner.name)
  const addresses = storedSafe.owners.map((owner) => checksumAddress(owner.address))
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))
  const activeTokens = Set(storedSafe.activeTokens)
  const activeAssets = Set(storedSafe.activeAssets)
  const blacklistedTokens = Set(storedSafe.blacklistedTokens)
  const blacklistedAssets = Set(storedSafe.blacklistedAssets)
  const balances = Map(storedSafe.balances)

  const safe = {
    ...storedSafe,
    owners,
    balances,
    activeTokens,
    blacklistedTokens,
    activeAssets,
    blacklistedAssets,
  }

  return safe
}

export default handleActions(
  {
    [UPDATE_SAFE]: (state: SafeReducerMap, action) => {
      const safe = action.payload
      const safeAddress = safe.address

      return state.updateIn(
        ['safes', safeAddress],
        makeSafe({ name: 'LOADED SAFE', address: safeAddress }),
        (prevSafe) => prevSafe.merge(safe),
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

            map.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge({ activeTokens }))
          })
      })
    },
    [ADD_SAFE]: (state: SafeReducerMap, action) => {
      const { safe } = action.payload

      // if you add a new Safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.hasIn(['safes', safe.address])) {
        return state.updateIn(['safes', safe.address], (prevSafe) => prevSafe.merge(safe))
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
    [ADD_SAFE_MODULES]: (state: SafeReducerMap, action) => {
      const { modulesAddresses, safeAddress } = action.payload
      return state.setIn(['safes', safeAddress, 'modules'], modulesAddresses)
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

export * from './types/safe.d'
