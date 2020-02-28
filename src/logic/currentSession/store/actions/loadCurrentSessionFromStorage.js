// @flow
import { type Dispatch as ReduxDispatch } from 'redux'

import loadCurrentSession from '~/logic/currentSession/store/actions/loadCurrentSession'
import { makeCurrentSession } from '~/logic/currentSession/store/model/currentSession'
import { getCurrentSessionFromStorage } from '~/logic/currentSession/utils'
import { type GlobalState } from '~/store'

const loadCurrentSessionFromStorage = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  const currentSession = await getCurrentSessionFromStorage()

  dispatch(loadCurrentSession(makeCurrentSession(currentSession ? currentSession : {})))
}

export default loadCurrentSessionFromStorage
