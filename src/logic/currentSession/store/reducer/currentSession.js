// @flow
import { Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from '~/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from '~/logic/currentSession/store/actions/updateViewedSafes'
import { saveCurrentSessionToStorage } from '~/logic/currentSession/utils'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'

export type State = Map<string, *>

export default handleActions<State, *>(
  {
    [LOAD_CURRENT_SESSION]: (state: State, action: ActionType<Function>): State => state.merge(Map(action.payload)),
    [UPDATE_VIEWED_SAFES]: (state: State, action: ActionType<Function>): State => {
      const safeAddress = action.payload

      const newState = state.updateIn(['viewedSafes'], prev =>
        prev.includes(safeAddress) ? prev : [...prev, safeAddress],
      )

      saveCurrentSessionToStorage(newState)

      return newState
    },
  },
  Map(),
)
