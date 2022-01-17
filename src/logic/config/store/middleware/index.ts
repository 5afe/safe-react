import { Action } from 'redux'
import { _setChainId } from 'src/config'

import { clearCurrentSession } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import { clearSafeList } from 'src/logic/safe/store/actions/clearSafeList'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { CONFIG_ACTIONS } from '../actions'
import { currentChainId } from '../selectors'
import { store as reduxStore } from 'src/store'

export const configMiddleware =
  ({ dispatch, getState }: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<typeof CONFIG_ACTIONS.SET_CHAIN_ID>) => {
    const handledAction = next(action)

    const state = getState()
    switch (action.type) {
      case CONFIG_ACTIONS.SET_CHAIN_ID: {
        _setChainId(currentChainId(state))

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
