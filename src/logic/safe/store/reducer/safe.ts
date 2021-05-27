import { Map, List } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { ADD_SAFE_OWNER } from 'src/logic/safe/store/actions/addSafeOwner'
import { EDIT_SAFE_OWNER } from 'src/logic/safe/store/actions/editSafeOwner'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { REMOVE_SAFE_OWNER } from 'src/logic/safe/store/actions/removeSafeOwner'
import { REPLACE_SAFE_OWNER } from 'src/logic/safe/store/actions/replaceSafeOwner'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from 'src/logic/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'
import { ADD_OR_UPDATE_SAFE, buildOwnersFrom } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { shouldSafeStoreBeUpdated } from 'src/logic/safe/utils/shouldSafeStoreBeUpdated'
import { LOADED_SAFE_KEY } from 'src/utils/constants'

export const SAFE_REDUCER_ID = 'safes'
export const DEFAULT_SAFE_INITIAL_STATE = 'NOT_ASKED'

export const buildSafe = (storedSafe: SafeRecordProps): SafeRecordProps => {
  const names = storedSafe.owners.map((owner) => owner.name)
  const addresses = storedSafe.owners.map((owner) => checksumAddress(owner.address))
  const owners = buildOwnersFrom(Array.from(names), Array.from(addresses))

  return {
    ...storedSafe,
    owners,
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
            ? record.set(key, safe[key])
            : record.update(key, (current) => current.merge(safe[key]))
        }
      } else {
        // By default we overwrite the value. This is for strings, numbers and unset values
        record.set(key, safe[key])
      }
    })
  })
}

export type SafePayload = { safe: SafeRecord }
type SafePayloads = SafeRecord | SafePayload | string

type BaseOwnerPayload = { safeAddress: string; ownerAddress: string }
type FullOwnerPayload = BaseOwnerPayload & { ownerName: string }
type ReplaceOwnerPayload = FullOwnerPayload & { oldOwnerAddress: string }

type OwnerPayloads = BaseOwnerPayload | FullOwnerPayload | ReplaceOwnerPayload

type SafeWithAddressPayload = SafeRecord & { safeAddress: string }

type Payloads = SafePayloads | OwnerPayloads | SafeWithAddressPayload

export default handleActions<AppReduxState['safes'], Payloads>(
  {
    [UPDATE_SAFE]: (state, action: Action<SafeRecord>) => {
      const safe = action.payload
      const safeAddress = safe.address

      const shouldUpdate = shouldSafeStoreBeUpdated(safe, state.getIn(['safes', safeAddress]))

      return shouldUpdate
        ? state.updateIn(
            ['safes', safeAddress],
            // This intermediate value is used as prevSafe if no previous state. Else is not used
            makeSafe({
              name: safe?.name || LOADED_SAFE_KEY,
              address: safeAddress,
              loadedViaUrl: !safe?.name || safe?.name === LOADED_SAFE_KEY,
            }),
            (prevSafe) => updateSafeProps(prevSafe, safe),
          )
        : state
    },
    [ADD_OR_UPDATE_SAFE]: (state, action: Action<SafePayload>) => {
      const { safe } = action.payload
      const safeAddress = safe.address

      if (!state.hasIn(['safes', safeAddress])) {
        return state.setIn(['safes', safeAddress], makeSafe(safe))
      }

      const shouldUpdate = shouldSafeStoreBeUpdated(safe, state.getIn(['safes', safeAddress]))
      return shouldUpdate
        ? state.updateIn(
            ['safes', safeAddress],
            // This intermediate value is used as prevSafe if no previous state. Else is not used
            makeSafe({
              name: safe?.name || LOADED_SAFE_KEY,
              address: safeAddress,
              loadedViaUrl: !safe?.name || safe?.name === LOADED_SAFE_KEY,
            }),
            (prevSafe) => updateSafeProps(prevSafe, safe),
          )
        : state
    },
    [REMOVE_SAFE]: (state, action: Action<string>) => {
      const safeAddress = action.payload

      const currentDefaultSafe = state.get('defaultSafe')

      let newState = state.deleteIn(['safes', safeAddress])
      if (sameAddress(safeAddress, currentDefaultSafe)) {
        newState = newState.set('defaultSafe', DEFAULT_SAFE_INITIAL_STATE)
      }

      return newState
    },
    [ADD_SAFE_OWNER]: (state, action: Action<FullOwnerPayload>) => {
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
    [REMOVE_SAFE_OWNER]: (state, action: Action<BaseOwnerPayload>) => {
      const { ownerAddress, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners.filter((o) => o.address.toLowerCase() !== ownerAddress.toLowerCase()),
        }),
      )
    },
    [REPLACE_SAFE_OWNER]: (state, action: Action<ReplaceOwnerPayload>) => {
      const { oldOwnerAddress, ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) =>
        prevSafe.merge({
          owners: prevSafe.owners
            .filter((o) => o.address.toLowerCase() !== oldOwnerAddress.toLowerCase())
            .push(makeOwner({ address: ownerAddress, name: ownerName })),
        }),
      )
    },
    [EDIT_SAFE_OWNER]: (state, action: Action<FullOwnerPayload>) => {
      const { ownerAddress, ownerName, safeAddress } = action.payload

      return state.updateIn(['safes', safeAddress], (prevSafe) => {
        const ownerToUpdateIndex = prevSafe.owners.findIndex(
          (o) => o.address.toLowerCase() === ownerAddress.toLowerCase(),
        )
        const updatedOwners = prevSafe.owners.update(ownerToUpdateIndex, (owner) => owner.set('name', ownerName))
        return prevSafe.merge({ owners: updatedOwners })
      })
    },
    [SET_DEFAULT_SAFE]: (state, action: Action<SafeRecord>) => state.set('defaultSafe', action.payload),
    [SET_LATEST_MASTER_CONTRACT_VERSION]: (state, action: Action<SafeRecord>) =>
      state.set('latestMasterContractVersion', action.payload),
  },
  Map({
    defaultSafe: DEFAULT_SAFE_INITIAL_STATE,
    safes: Map(),
    latestMasterContractVersion: '',
  }) as AppReduxState['safes'],
)
