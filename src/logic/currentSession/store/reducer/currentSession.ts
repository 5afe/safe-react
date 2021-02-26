import { Action, handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'
import { AppReduxState } from 'src/store'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'

export type CurrentSessionState = {
  viewedSafes: string[]
}

export const initialState = {
  viewedSafes: [],
}

type CurrentSessionPayloads = CurrentSessionState | string

export default handleActions<AppReduxState['currentSession'], CurrentSessionPayloads>(
  {
    [LOAD_CURRENT_SESSION]: (state = initialState, action: Action<CurrentSessionState>) => ({
      ...state,
      ...action.payload,
    }),
    [UPDATE_VIEWED_SAFES]: (state, action: Action<string>) => {
      const safeAddress = action.payload
      const viewedSafes = state.viewedSafes
      const newState = {
        ...state,
        viewedSafes: viewedSafes.includes(safeAddress) ? viewedSafes : [...viewedSafes, safeAddress],
      }

      saveCurrentSessionToStorage(newState)

      return newState
    },
  },
  initialState,
)
