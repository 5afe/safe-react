import { Action, handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { CLEAR_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'
import { AppReduxState } from 'src/store'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'
const MAX_VIEWED_SAFES = 10

export type CurrentSessionState = {
  viewedSafes: string[]
  restored: boolean
}

export const initialState = {
  viewedSafes: [],
  restored: false,
}

type CurrentSessionPayloads = CurrentSessionState | string

export default handleActions<AppReduxState['currentSession'], CurrentSessionPayloads>(
  {
    [LOAD_CURRENT_SESSION]: (state = initialState, action: Action<CurrentSessionState>) => ({
      ...state,
      ...action.payload,
      restored: true,
    }),
    [UPDATE_VIEWED_SAFES]: (state, action: Action<string>) => {
      const safeAddress = action.payload
      const viewedSafes = state.viewedSafes.filter((item) => item !== safeAddress)
      const newState = {
        ...state,
        viewedSafes: [safeAddress].concat(viewedSafes).slice(0, MAX_VIEWED_SAFES),
      }

      saveCurrentSessionToStorage(newState)

      return newState
    },
    [CLEAR_CURRENT_SESSION]: () => {
      return initialState
    },
  },
  initialState,
)
