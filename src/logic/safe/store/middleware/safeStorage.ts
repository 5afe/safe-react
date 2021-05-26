import { saveDefaultSafe, saveSafes } from 'src/logic/safe/utils'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { safesListWithAddressBookNameSelector, safesMapSelector } from 'src/logic/safe/store/selectors'

const watchedActions = [REMOVE_SAFE, SET_DEFAULT_SAFE, UPDATE_SAFE]

export const safeStorageMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const safes = safesMapSelector(state)
    const safeNameMap = Object.fromEntries(
      safesListWithAddressBookNameSelector(state)
        .map((safe) => [safe.address, safe.name])
        .toJSON(),
    )
    await saveSafes(safes.filter((safe) => safeNameMap[safe.address]).toJSON())

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
