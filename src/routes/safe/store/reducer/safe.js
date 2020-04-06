// 
import { Map, Set } from 'immutable'
import { handleActions } from 'redux-actions'

import { getWeb3 } from 'src/logic/wallets/getWeb3'
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
import { UPDATE_SAFE_THRESHOLD } from 'src/routes/safe/store/actions/updateSafeThreshold'
import { makeOwner } from 'src/routes/safe/store/models/owner'
import SafeRecord, { } from 'src/routes/safe/store/models/safe'

export const SAFE_REDUCER_ID = 'safes'


export const buildSafe = (storedSafe) => {
  const names = storedSafe.owners.map((owner) => owner.name)
  const addresses = storedSafe.owners.map((owner) => getWeb3().utils.toChecksumAddress(owner.address))
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

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge(safe))
    },
    [ACTIVATE_TOKEN_FOR_ALL_SAFES]: (state, action) => {
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
    [ADD_SAFE]: (state, action) => {
      const { safe } = action.payload

      // if you add a new Safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.hasIn(['safes', safe.address])) {
        return state.updateIn(['safes', safe.address], (prevSafe) => prevSafe.merge(safe))
      }

      return state.setIn(['safes', safe.address], SafeRecord(safe))
    },
    [REMOVE_SAFE]: (state, action) => {
      const safeAddress = action.payload

      return state.deleteIn(['safes', safeAddress])
    },
    [ADD_SAFE_OWNER]: (state, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [REMOVE_SAFE_OWNER]: (state, action) => {
      const { ownerAddress, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
        }),
      )
    },
    [REPLACE_SAFE_OWNER]: (state, action) => {
      const { oldOwnerAddress, ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners
            .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
            .push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [EDIT_SAFE_OWNER]: (state, action) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
    [UPDATE_SAFE_THRESHOLD]: (state, action) => {
      const { safeAddress, threshold } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.set('threshold', threshold))
    },
    [SET_DEFAULT_SAFE]: (state, action) =>
      state.set('defaultSafe', action.payload),
    [SET_LATEST_MASTER_CONTRACT_VERSION]: (state, action) =>
      state.set('latestMasterContractVersion', action.payload),
  },
  Map({
    // $FlowFixMe
    defaultSafe: undefined,
    safes: Map(),
    // $FlowFixMe
    latestMasterContractVersion: '',
  }),
)
