import { Action, handleActions } from 'redux-actions'

import { AppReduxState } from 'src/store'
import { SET_COPY_SHORT_NAME } from '../actions/setCopyShortName'
import { SET_SHOW_SHORT_NAME } from '../actions/setShowShortName'

export const APPEARANCE_REDUCER_ID = 'appearance'

export const initialAppearanceState = {
  copyShortName: true,
  showShortName: true,
}

export type AppearanceState = typeof initialAppearanceState

export type SetCopyShortNamePayload = Pick<AppearanceState, 'copyShortName'>
export type SetShowShortNamePayload = Pick<AppearanceState, 'showShortName'>

export default handleActions<AppReduxState['appearance'], AppearanceState>(
  {
    [SET_COPY_SHORT_NAME]: (state, { payload }: Action<SetCopyShortNamePayload>): AppearanceState => ({
      ...state,
      copyShortName: payload.copyShortName,
    }),
    [SET_SHOW_SHORT_NAME]: (state, { payload }: Action<SetShowShortNamePayload>): AppearanceState => ({
      ...state,
      showShortName: payload.showShortName,
    }),
  },
  initialAppearanceState,
)
