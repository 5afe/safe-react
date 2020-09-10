import { Dispatch } from 'redux'

import loadCurrentSession from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { getCurrentSessionFromStorage } from 'src/logic/currentSession/utils'

const loadCurrentSessionFromStorage = () => async (dispatch: Dispatch): Promise<void> => {
  const currentSession = await getCurrentSessionFromStorage()

  dispatch(loadCurrentSession(currentSession))
}

export default loadCurrentSessionFromStorage
