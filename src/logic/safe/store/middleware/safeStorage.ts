import { Store } from 'redux'

import { saveSafes } from 'src/logic/safe/utils'
import { REMOVE_SAFE } from 'src/logic/safe/store/actions/removeSafe'
import { UPDATE_SAFE } from 'src/logic/safe/store/actions/updateSafe'
import { safesAsMap } from 'src/logic/safe/store/selectors'
import { SafeRecord } from '../models/safe'

const watchedActions = [REMOVE_SAFE, UPDATE_SAFE]

type SafeProps = {
  safe: SafeRecord
}

export const safeStorageMiddleware =
  (store: Store) =>
  (next: (arg0: { type: string; payload: string | SafeProps | { address: string; name: string } }) => any) =>
  async (action: { type: string; payload: string | SafeProps | { name: string; address: string } }): Promise<any> => {
    const handledAction = next(action)

    if (watchedActions.includes(action.type)) {
      const state = store.getState()
      const safesMap = safesAsMap(state)
      await saveSafes(safesMap.filter((safe) => !safe.loadedViaUrl).toJSON())
    }

    return handledAction
  }
