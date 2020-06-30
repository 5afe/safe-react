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
    [UPDATE_SAFE]: (state, action) => {
      const safe = action.payload
      const safeAddress = safe.address

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) => prevSafe.merge(safe))
    },
    [ACTIVATE_TOKEN_FOR_ALL_SAFES]: (state, action) => {
      const tokenAddress = action.payload

      return state.withMutations((map) => {
        map
          .get(SAFE_REDUCER_ID)
          .keySeq()
          .forEach((safeAddress) => {
            const safeActiveTokens = map.getIn([SAFE_REDUCER_ID, safeAddress, 'activeTokens'])
            const activeTokens = safeActiveTokens.add(tokenAddress)

            map.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) => prevSafe.merge({ activeTokens }))
          })
      })
    },
    [ADD_SAFE]: (state, action) => {
      const { safe } = action.payload

      // if you add a new Safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.hasIn([SAFE_REDUCER_ID, safe.address])) {
        return state.updateIn([SAFE_REDUCER_ID, safe.address], (prevSafe) => prevSafe.merge(safe))
      }

      return state.setIn([SAFE_REDUCER_ID, safe.address], makeSafe(safe))
    },
    [REMOVE_SAFE]: (state, action) => {
      const safeAddress = action.payload

      return state.deleteIn([SAFE_REDUCER_ID, safeAddress])
    },
    [ADD_SAFE_OWNER]: (state, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [REMOVE_SAFE_OWNER]: (state, action) => {
      const { ownerAddress, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
        }),
      )
    },
    [REPLACE_SAFE_OWNER]: (state, action) => {
      const { oldOwnerAddress, ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners
            .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
            .push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [EDIT_SAFE_OWNER]: (state, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
    [SET_DEFAULT_SAFE]: (state, action) => state.set('defaultSafe', action.payload),
    [SET_LATEST_MASTER_CONTRACT_VERSION]: (state, action) => state.set('latestMasterContractVersion', action.payload),
  },
  Map({
    defaultSafe: DEFAULT_SAFE_INITIAL_STATE,
    safes: Map(),
    latestMasterContractVersion: '',
  }),
)
