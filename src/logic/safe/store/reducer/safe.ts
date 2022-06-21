import { Map, List } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { SET_LATEST_MASTER_CONTRACT_VERSION } from 'src/logic/safe/store/actions/setLatestMasterContractVersion'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import makeSafe, { SafeRecord, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { checksumAddress } from 'src/utils/checksumAddress'
import { ADD_OR_UPDATE_SAFE } from 'src/logic/safe/store/actions/addOrUpdateSafe'
import { CLEAR_SAFE_LIST } from 'src/logic/safe/store/actions/clearSafeList'
import { shouldSafeStoreBeUpdated } from 'src/logic/safe/utils/shouldSafeStoreBeUpdated'
import { SafeReducerMap } from './types/safe'

export const SAFE_REDUCER_ID = 'safes'

export const buildSafe = (storedSafe: SafeRecordProps): SafeRecordProps => {
  const owners = storedSafe.owners.map(checksumAddress)

  return {
    ...storedSafe,
    loaded: false,
    owners,
    modules: null,
  }
}

// Merge new polling tags into safe
const mergeNewTagsInSafe = (state: SafeReducerMap, newSafe: SafeRecord, safeAddress: string) => {
  state.mergeIn(['safes', safeAddress], {
    collectiblesTag: newSafe.collectiblesTag,
    txQueuedTag: newSafe.txQueuedTag,
    txHistoryTag: newSafe.txHistoryTag,
  })
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
        } else {
          // TODO: temporary fix if type is AddressEx because it's neither a Map, nor has a size property
          record.set(key, safe[key])
        }
      } else {
        // By default we overwrite the value. This is for strings, numbers and unset values
        record.set(key, safe[key])
      }
    })
  })
}

type Payloads = SafeRecord | string

const safeReducer = handleActions<SafeReducerMap, Payloads>(
  {
    [UPDATE_SAFE]: (state, action: Action<SafeRecord>) => {
      const safe = action.payload
      const safeAddress = safe.address

      mergeNewTagsInSafe(state, safe, safeAddress)

      const shouldUpdate = shouldSafeStoreBeUpdated(safe, state.getIn(['safes', safeAddress]) as SafeRecordProps)

      return shouldUpdate
        ? state.updateIn(['safes', safeAddress], makeSafe({ address: safeAddress }), (prevSafe) =>
            updateSafeProps(prevSafe, safe),
          )
        : state
    },
    [ADD_OR_UPDATE_SAFE]: (state, action: Action<SafeRecord>) => {
      const safe = action.payload
      const safeAddress = safe.address

      if (!state.hasIn(['safes', safeAddress])) {
        return state.setIn(['safes', safeAddress], makeSafe(safe))
      }

      mergeNewTagsInSafe(state, safe, safeAddress)

      const shouldUpdate = shouldSafeStoreBeUpdated(safe, state.getIn(['safes', safeAddress]) as SafeRecordProps)

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
    [CLEAR_SAFE_LIST]: (state) => {
      return state.set('safes', Map())
    },
    [SET_LATEST_MASTER_CONTRACT_VERSION]: (state, action: Action<SafeRecord>) =>
      state.set('latestMasterContractVersion', action.payload),
  },
  Map({
    safes: Map(),
    latestMasterContractVersion: '',
  }) as SafeReducerMap,
)

export default safeReducer
