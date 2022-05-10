import { Dispatch } from 'redux'

import loadCurrentSession from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { getCurrentSessionFromStorage } from 'src/logic/currentSession/utils'

const loadCurrentSessionFromStorage =
  () =>
  (dispatch: Dispatch): void => {
    const currentSession = getCurrentSessionFromStorage()

    dispatch(loadCurrentSession(currentSession))
  }

export default loadCurrentSessionFromStorage
