import { handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'

export type SerializedSessionState = string[]

export default handleActions(
  {
    [LOAD_CURRENT_SESSION]: (state, action) => {
      return action.payload
    },
    [UPDATE_VIEWED_SAFES]: (state, action) => {
      const safeAddress = action.payload

      if (!state.includes(safeAddress)) {
        state.push(safeAddress)
        saveCurrentSessionToStorage(state)
      }

      return state
    },
  },
  [],
)
