import { Action, handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { CLEAR_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'
import { REMOVE_VIEWED_SAFE } from '../actions/removeViewedSafe'
import { ADD_CURRENT_SAFE_ADDRESS } from 'src/logic/currentSession/store/actions/addCurrentSafeAddress'
import { ADD_CURRENT_SHORT_NAME } from '../actions/addCurrentShortName'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'
const MAX_VIEWED_SAFES = 10

export type CurrentSessionState = {
  viewedSafes: string[]
  currentSafeAddress: string
  currentShortName: string
  restored: boolean
}

export const initialState = {
  viewedSafes: [],
  currentSafeAddress: '',
  currentShortName: '',
  restored: false,
}

type CurrentSessionPayloads = CurrentSessionState | string

const currentSessionReducer = handleActions<CurrentSessionState, CurrentSessionPayloads>(
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
    [REMOVE_VIEWED_SAFE]: (state, action: Action<string>) => {
      const safeAddress = action.payload
      const newState = {
        ...state,
        viewedSafes: state.viewedSafes.filter((item) => item !== safeAddress),
      }

      saveCurrentSessionToStorage(newState)

      return newState
    },
    [CLEAR_CURRENT_SESSION]: () => {
      return initialState
    },
    [ADD_CURRENT_SHORT_NAME]: (state, action: Action<string>) => {
      const shortName = action.payload
      const newState = {
        ...state,
        currentShortName: shortName,
      }

      return newState
    },
    [ADD_CURRENT_SAFE_ADDRESS]: (state, action: Action<string>) => {
      const safeAddress = action.payload
      const newState = {
        ...state,
        currentSafeAddress: safeAddress,
      }

      return newState
    },
  },
  initialState,
)

export default currentSessionReducer
