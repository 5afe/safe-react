import { handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'

export type CurrentSessionState = {
  viewedSafes: string[]
}

export const initialState = {
  viewedSafes: [],
}

export default handleActions(
  {
    [LOAD_CURRENT_SESSION]: (state = initialState, action) => ({
      ...state,
      ...action.payload,
    }),
    [UPDATE_VIEWED_SAFES]: (state, action) => {
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
