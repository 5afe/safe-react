import loadCurrentSession from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { makeCurrentSession } from 'src/logic/currentSession/store/model/currentSession'
import { getCurrentSessionFromStorage } from 'src/logic/currentSession/utils'

const loadCurrentSessionFromStorage = () => async (dispatch) => {
  const currentSession = await getCurrentSessionFromStorage()

  if (currentSession) {
    dispatch(loadCurrentSession(makeCurrentSession(currentSession)))
  }
}

export default loadCurrentSessionFromStorage
