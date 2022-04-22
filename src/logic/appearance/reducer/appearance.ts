import { Action, handleActions } from 'redux-actions'

import { SET_COPY_SHORT_NAME } from '../actions/setCopyShortName'
import { SET_SHOW_SHORT_NAME } from '../actions/setShowShortName'
import { TOGGLE_BATCH_EXECUTE } from '../actions/toggleBatchExecute'

export const APPEARANCE_REDUCER_ID = 'appearance'

export const initialAppearanceState = {
  copyShortName: true,
  showShortName: true,
  batchExecute: false,
}

export type AppearanceState = typeof initialAppearanceState

export type SetCopyShortNamePayload = Pick<AppearanceState, 'copyShortName'>
export type SetShowShortNamePayload = Pick<AppearanceState, 'showShortName'>

const appearanceReducer = handleActions<AppearanceState, AppearanceState>(
  {
    [SET_COPY_SHORT_NAME]: (state, { payload }: Action<SetCopyShortNamePayload>): AppearanceState => ({
      ...state,
      copyShortName: payload.copyShortName,
    }),
    [SET_SHOW_SHORT_NAME]: (state, { payload }: Action<SetShowShortNamePayload>): AppearanceState => ({
      ...state,
      showShortName: payload.showShortName,
    }),
    [TOGGLE_BATCH_EXECUTE]: (state): AppearanceState => ({
      ...state,
      batchExecute: !state.batchExecute,
    }),
  },
  initialAppearanceState,
)

export default appearanceReducer
