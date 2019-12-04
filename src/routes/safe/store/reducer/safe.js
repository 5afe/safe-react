// @flow
import { Map, Set } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { ADD_SAFE, buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'
import SafeRecord, { type SafeProps } from '~/routes/safe/store/models/safe'
import { makeOwner, type OwnerProps } from '~/routes/safe/store/models/owner'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import { ACTIVATE_TOKEN_FOR_ALL_SAFES } from '~/routes/safe/store/actions/activateTokenForAllSafes'
import { REMOVE_SAFE } from '~/routes/safe/store/actions/removeSafe'
import { ADD_SAFE_OWNER } from '~/routes/safe/store/actions/addSafeOwner'
import { REMOVE_SAFE_OWNER } from '~/routes/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from '~/routes/safe/store/actions/replaceSafeOwner'
import { EDIT_SAFE_OWNER } from '~/routes/safe/store/actions/editSafeOwner'
import { SET_DEFAULT_SAFE } from '~/routes/safe/store/actions/setDefaultSafe'

export const SAFE_REDUCER_ID = 'safes'

export type SafeReducerState = Map<string, *>

export const buildSafe = (storedSafe: SafeProps) => {
  const names = storedSafe.owners.map((owner: OwnerProps) => owner.name)
  const addresses = storedSafe.owners.map((owner: OwnerProps) => owner.address)
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))
  const activeTokens = Set(storedSafe.activeTokens)
  const blacklistedTokens = Set(storedSafe.blacklistedTokens)
  const balances = Map(storedSafe.balances)

  const safe: SafeProps = {
    ...storedSafe,
    owners,
    balances,
    activeTokens,
    blacklistedTokens,
  }

  return safe
}

export default handleActions<SafeReducerState, *>(
  {
    [UPDATE_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const safe = action.payload
      const safeAddress = safe.address

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge(safe))
    },
    [ACTIVATE_TOKEN_FOR_ALL_SAFES]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const tokenAddress = action.payload

      const newState = state.withMutations((map) => {
        map.get('safes').keySeq().forEach((safeAddress) => {
          const safeActiveTokens = map.getIn(['safes', safeAddress, 'activeTokens'])
          const activeTokens = safeActiveTokens.add(tokenAddress)

          map.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge({ activeTokens }))
        })
      })

      return newState
    },
    [ADD_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { safe }: { safe: SafeProps } = action.payload

      // if you add a new Safe it needs to be set as a record
      // in case of update it shouldn't, because a record would be initialized
      // with initial props and it would overwrite existing ones

      if (state.hasIn(['safes', safe.address])) {
        return state.updateIn(['safes', safe.address], (prevSafe) => prevSafe.merge(safe))
      }

      return state.setIn(['safes', safe.address], SafeRecord(safe))
    },
    [REMOVE_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const safeAddress = action.payload

      return state.deleteIn(['safes', safeAddress])
    },
    [ADD_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { safeAddress, ownerName, ownerAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge({
        owners: prevSafe.owners.push(makeOwner({ address: ownerAddress, name: ownerName })),
      }))
    },
    [REMOVE_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { safeAddress, ownerAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge({
        owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
      }))
    },
    [REPLACE_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const {
        safeAddress, oldOwnerAddress, ownerName, ownerAddress,
      } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => prevSafe.merge({
        owners: prevSafe.owners
          .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
          .push(makeOwner({ address: ownerAddress, name: ownerName })),
      }))
    },
    [EDIT_SAFE_OWNER]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => {
      const { safeAddress, ownerAddress, ownerName } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
    [SET_DEFAULT_SAFE]: (state: SafeReducerState, action: ActionType<Function>): SafeReducerState => state.set('defaultSafe', action.payload),
  },
  Map({
    // $FlowFixMe
    defaultSafe: undefined,
    safes: Map(),
  }),
)
