import { Action } from 'redux'

import { clearCurrentSession } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import { clearSafeList } from 'src/logic/safe/store/actions/clearSafeList'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { CONFIG_ACTIONS } from '../actions'

export const configMiddleware =
  ({ dispatch }) =>
  (next: Dispatch) =>
  async (action: Action<typeof CONFIG_ACTIONS.SET_CHAIN_ID>) => {
    const handledAction = next(action)

    switch (action.type) {
      case CONFIG_ACTIONS.SET_CHAIN_ID: {
        dispatch(clearSafeList())
        dispatch(clearCurrentSession())
        dispatch(loadSafesFromStorage())
        dispatch(loadCurrentSessionFromStorage())
        break
      }
      default:
        break
    }

    return handledAction
  }
