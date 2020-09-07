import loadCurrentSession from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { getCurrentSessionFromStorage } from 'src/logic/currentSession/utils'
import { Dispatch } from 'redux'

const loadCurrentSessionFromStorage = () => async (dispatch: Dispatch): Promise<void> => {
  const currentSession = await getCurrentSessionFromStorage()

  if (currentSession) {
    dispatch(loadCurrentSession(currentSession))
  }
}

export default loadCurrentSessionFromStorage
