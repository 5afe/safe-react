import { Store } from 'redux'

import { saveDefaultSafe, saveSafes } from 'src/logic/safe/utils'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { SET_DEFAULT_SAFE } from 'src/logic/safe/store/actions/setDefaultSafe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { safesMapSelector } from 'src/logic/safe/store/selectors'
import { SafeRecord } from '../models/safe'

const watchedActions = [REMOVE_SAFE, SET_DEFAULT_SAFE, UPDATE_SAFE]

type SafeProps = {
  safe: SafeRecord
}

export const safeStorageMiddleware = (store: Store) => (
  next: (arg0: { type: string; payload: string | SafeProps | { address: string; name: string } }) => any,
) => async (action: {
  type: string
  payload: string | SafeProps | { name: string; address: string }
}): Promise<any> => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const safes = safesMapSelector(state)
    await saveSafes(safes.filter((safe) => !safe.loadedViaUrl).toJSON())

    switch (action.type) {
      case SET_DEFAULT_SAFE: {
        if (action.payload) {
          saveDefaultSafe(action.payload as string)
        }
        break
      }
      default:
        break
    }
  }

  return handledAction
}
