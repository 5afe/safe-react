import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'

export default handleActions(
  {
    [LOAD_CURRENT_SESSION]: (state, action) => state.merge(Map(action.payload)),
    [UPDATE_VIEWED_SAFES]: (state, action) => {
      const safeAddress = action.payload

      const newState = state.updateIn(['viewedSafes'], (prev) =>
        prev.includes(safeAddress) ? prev : [...prev, safeAddress],
      )

      saveCurrentSessionToStorage(newState)

      return newState
    },
  },
  Map(),
)
