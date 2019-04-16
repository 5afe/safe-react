// @flow
import { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import type { Store, AnyAction } from 'redux'
import { type GlobalState } from '~/store/'
import { saveSafes, setOwners } from '~/logic/safe/utils'
import { safesMapSelector } from '~/routes/safeList/store/selectors/index'

const watchedActions = [ADD_SAFE, UPDATE_SAFE]

const safeStorageMware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    const safes = safesMapSelector(state)
    saveSafes(safes.toJSON())

    if (action.type === ADD_SAFE) {
      const { safe } = action.payload
      setOwners(safe.address, safe.owners)
    }
  }

  return handledAction
}

export default safeStorageMware
