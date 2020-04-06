// @flow
import { Map, Set } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { getWeb3 } from '~/logic/wallets/getWeb3'
import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from '~/routes/safe/store/actions/activateTokenForAllSafes'
import { ADD_SAFE, buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import { ADD_SAFE_OWNER } from '~/routes/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from '~/routes/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from '~/routes/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from '~/routes/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from '~/routes/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from '~/routes/safe/store/actions/setDefaultSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from '~/routes/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import { makeOwner } from '~/routes/safe/store/models/owner'
import SafeRecord, { type SafeProps } from '~/routes/safe/store/models/safe'

export const SAFE_REDUCER_ID = 'safes'

export type SafeReducerState = Map<string, *>

export const buildSafe = (storedSafe: SafeProps) => {
  const names = storedSafe.owners.map((owner) => owner.name)
  const addresses = storedSafe.owners.map((owner) => getWeb3().utils.toChecksumAddress(owner.address))
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))
  const activeTokens = Set(storedSafe.activeTokens)
  const activeAssets = Set(storedSafe.activeAssets)
  const blacklistedTokens = Set(storedSafe.blacklistedTokens)
  const blacklistedAssets = Set(storedSafe.blacklistedAssets)
  const balances = Map(storedSafe.balances)

  const safe: SafeProps = {
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

export default handleActions<SafeReducerState, *>(
  {
    [UPDATE_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const safe = action.payload
      const safeAddress = safe.address
      const isNonceUpdate = safe.nonce !== undefined

      if (isNonceUpdate && safe.nonce <= state.getIn([SAFE_REDUCER_ID, safeAddress, 'nonce'])) {
        // update only when nonce is greater than the one already stored
        // this will prevent undesired changes in the safe's state when
        // txs pagination is implemented
        return state
      }

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) => prevSafe.merge(safe))
    },
    [ACTIVATE_TOKEN_FOR_ALL_SAFES]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
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
    [ADD_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { safe }: { safe: SafeProps } = action.payload

      // if you add a new Safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.hasIn([SAFE_REDUCER_ID, safe.address])) {
        return state.updateIn([SAFE_REDUCER_ID, safe.address], (prevSafe) => prevSafe.merge(safe))
      }

      return state.setIn([SAFE_REDUCER_ID, safe.address], SafeRecord(safe))
    },
    [REMOVE_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const safeAddress = action.payload

      return state.deleteIn([SAFE_REDUCER_ID, safeAddress])
    },
    [ADD_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [REMOVE_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { ownerAddress, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
        }),
      )
    },
    [REPLACE_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { oldOwnerAddress, ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners
            .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
            .push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [EDIT_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn([SAFE_REDUCER_ID, safeAddress], (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
    [SET_DEFAULT_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState =>
      state.set('defaultSafe', action.payload),
    [SET_LATEST_MASTER_CONTRACT_VERSION]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState =>
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
