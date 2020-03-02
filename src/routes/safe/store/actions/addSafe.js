// @flow
import { List } from 'immutable'
import type { GetState, Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'

import setDefaultSafe from '~/routes/safe/store/actions/setDefaultSafe'
import { makeOwner } from '~/routes/safe/store/models/owner'
import { type Safe } from '~/routes/safe/store/models/safe'
import { safesListSelector } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'

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
