import { saveDefaultSafe, saveSafes } from 'src/logic/safe/utils'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { safesMapSelector } from 'src/logic/safe/store/selectors'

const watchedActions = [SET_DEFAULT_SAFE]

export const safeStorageMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const safes = safesMapSelector(state)
    await saveSafes(safes.filter((safe) => !safe.loadedViaUrl).toJSON())

    switch (action.type) {
      case SET_DEFAULT_SAFE: {
        if (action.payload) {
          saveDefaultSafe(action.payload)
        }
        break
      }
      default:
        break
    }
  }

  return handledAction
}
