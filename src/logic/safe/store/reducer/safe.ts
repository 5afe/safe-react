import { Map, List } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from 'src/logic/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'
import { ADD_OR_UPDATE_SAFE } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { shouldSafeStoreBeUpdated } from 'src/logic/safe/utils/shouldSafeStoreBeUpdated'

export const SAFE_REDUCER_ID = 'safes'
export const DEFAULT_SAFE_INITIAL_STATE = 'NOT_ASKED'

export const buildSafe = (storedSafe: SafeRecordProps): SafeRecordProps => {
  const owners = storedSafe.owners.map(checksumAddress)

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
        ? state.updateIn(['safes', safeAddress], makeSafe({ address: safeAddress }), (prevSafe) =>
            updateSafeProps(prevSafe, safe),
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
        ? state.updateIn(['safes', safeAddress], makeSafe({ address: safeAddress }), (prevSafe) =>
            updateSafeProps(prevSafe, safe),
          )
        : state
    },
    [REMOVE_SAFE]: (state, action: Action<string>) => {
      const safeAddress = action.payload
      const newState = state.deleteIn(['safes', safeAddress])

      return newState
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
