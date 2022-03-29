import { Action, handleActions } from 'redux-actions'

import { SET_COPY_SHORT_NAME } from '../actions/setCopyShortName'
import { SET_SHOW_SHORT_NAME } from '../actions/setShowShortName'
import { SET_BATCH_EXECUTE } from '../actions/setBatchExecute'

export const APPEARANCE_REDUCER_ID = 'appearance'

export const initialAppearanceState = {
  copyShortName: true,
  showShortName: true,
  batchExecute: false,
}

export type AppearanceState = typeof initialAppearanceState

export type SetCopyShortNamePayload = Pick<AppearanceState, 'copyShortName'>
export type SetShowShortNamePayload = Pick<AppearanceState, 'showShortName'>
export type SetBatchExecutePayload = Pick<AppearanceState, 'batchExecute'>

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
    [SET_BATCH_EXECUTE]: (state, { payload }: Action<SetBatchExecutePayload>): AppearanceState => ({
      ...state,
      batchExecute: payload.batchExecute,
    }),
  },
  initialAppearanceState,
)

export default appearanceReducer
