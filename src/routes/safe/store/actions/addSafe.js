// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type GlobalState } from '~/safeStore'
import { safesListSelector } from '~/routes/safe/store/selectors'
import { type Safe } from '~/routes/safe/store/models/safe'
import { makeOwner } from '~/routes/safe/store/models/owner'
import setDefaultSafe from '~/routes/safe/store/actions/setDefaultSafe'

export const ADD_SAFE = 'ADD_SAFE'

export const buildOwnersFrom = (names: Array<string>, addresses: Array<string>) => {
  const owners = names.map((name: string, index: number) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

type ActionReturn = {
  safe: Safe,
}

export const addSafe = createAction<string, Function, ActionReturn>(ADD_SAFE, (safe: Safe): ActionReturn => ({
  safe,
}))

const saveSafe = (safe: Safe) => (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state = getState()
  const safeList = safesListSelector(state)

  dispatch(addSafe(safe))

  if (safeList.size === 0) {
    dispatch(setDefaultSafe(safe.address))
  }
}

export default saveSafe
