import { createSelector } from 'reselect'

import { CURRENT_SESSION_REDUCER_ID, CurrentSessionState } from 'src/logic/currentSession/store/reducer/currentSession'
import { AppReduxState } from 'src/store'

export const lastViewedSafe = (state: AppReduxState['currentSession']): string | null => {
  const currentSession = state[CURRENT_SESSION_REDUCER_ID]
  if (!currentSession.restored) {
    return null
  }
  return currentSession.viewedSafes[0] || ''
}

export const currentSession = (state: AppReduxState): CurrentSessionState => state[CURRENT_SESSION_REDUCER_ID]

export const currentSafeAddress = createSelector(currentSession, ({ currentSafeAddress }) => currentSafeAddress)
