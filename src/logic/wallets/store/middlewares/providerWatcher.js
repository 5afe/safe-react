// @flow
import type { Store, AnyAction } from 'redux'
import { type GlobalState } from '~/store/'
import { ADD_PROVIDER, REMOVE_PROVIDER } from '../actions'

const watchedActions = [
  ADD_PROVIDER,
  REMOVE_PROVIDER,
]

const providerWatcherMware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()

    switch (action.type) {
      default:
        break
    }
  }

  return handledAction
}

export default providerWatcherMware
