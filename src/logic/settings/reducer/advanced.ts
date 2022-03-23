import { Action, handleActions } from 'redux-actions'

import { SET_BATCH_EXECUTE } from '../actions/setBatchExecute'

export const ADVANCED_SETTINGS_REDUCER_ID = 'settings'

export const initialAdvancedSettingsState = {
  batchExecute: true,
}

export type AdvancedSettingsState = typeof initialAdvancedSettingsState

export type SetBatchExecutePayload = Pick<AdvancedSettingsState, 'batchExecute'>

const advancedSettingsReducer = handleActions<AdvancedSettingsState>(
  {
    [SET_BATCH_EXECUTE]: (state, { payload }: Action<SetBatchExecutePayload>): AdvancedSettingsState => ({
      ...state,
      batchExecute: payload.batchExecute,
    }),
  },
  initialAdvancedSettingsState,
)

export default advancedSettingsReducer
