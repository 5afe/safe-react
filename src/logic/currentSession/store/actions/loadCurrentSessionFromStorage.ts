//
import {} from 'redux'

import loadCurrentSession from 'logic/currentSession/store/actions/loadCurrentSession'
import { makeCurrentSession } from 'logic/currentSession/store/model/currentSession'
import { getCurrentSessionFromStorage } from 'logic/currentSession/utils'
import {} from 'store'

const loadCurrentSessionFromStorage = () => async (dispatch) => {
  const currentSession = await getCurrentSessionFromStorage()

  dispatch(loadCurrentSession(makeCurrentSession(currentSession ? currentSession : {})))
}

export default loadCurrentSessionFromStorage
