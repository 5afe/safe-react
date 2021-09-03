import { CONFIG_ACTIONS } from 'src/logic/config/store/actions'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { clearSafeList } from 'src/logic/safe/store/actions/clearSafeList'
import { switchToCurrentNetwork } from 'src/logic/wallets/utils/network'

const watchedActions = Object.values(CONFIG_ACTIONS)

export const configMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const { dispatch } = store
    switch (action.type) {
      case CONFIG_ACTIONS.CONFIG_STORE: {
        dispatch(clearSafeList())
        dispatch(loadSafesFromStorage())
        dispatch(loadCurrentSessionFromStorage())
        switchToCurrentNetwork()
        break
      }
      default:
        break
    }
  }

  return handledAction
}
