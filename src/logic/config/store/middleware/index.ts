import { Action } from 'redux-actions'

import { clearCurrentSession } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import { clearSafeList } from 'src/logic/safe/store/actions/clearSafeList'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { CONFIG_ACTIONS } from '../actions'
import { store as reduxStore } from 'src/store'
import { ChainId } from 'src/config/chain'
import onboard from 'src/logic/wallets/onboard'

export const configMiddleware =
  ({ dispatch }: typeof reduxStore) =>
  (next: Dispatch) =>
  async (action: Action<ChainId>) => {
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
