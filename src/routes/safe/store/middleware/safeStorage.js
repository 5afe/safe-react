// @flow
import { ADD_SAFE } from '~/routes/safe/store/actions/addSafe'
import { UPDATE_SAFE } from '~/routes/safe/store/actions/updateSafe'
import { saveToStorage } from '~/utils/storage'
import { SAFES_KEY } from '~/logic/safe/utils'
import type { GetState } from 'redux'
import { type GlobalState } from '~/store/'

const watchedActions = [ADD_SAFE, UPDATE_SAFE]

const safeStorageMware = store => next => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const { getState }: { getState: GetState } = store
    const state: GlobalState = store.getState()
    console.log(state)
  }
  return handledAction
}

export default safeStorageMware
