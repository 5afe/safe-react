import { CURRENT_SESSION_REDUCER_ID } from 'src/logic/currentSession/store/reducer/currentSession'
import { AppReduxState } from 'src/store'

export const lastViewedSafe = (state: AppReduxState['currentSession']): string | null => {
  const currentSession = state[CURRENT_SESSION_REDUCER_ID]
  if (!currentSession.restored) {
    return null
  }
  return currentSession.viewedSafes[0] || ''
}
