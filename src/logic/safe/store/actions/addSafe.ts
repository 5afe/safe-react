import { List } from 'immutable'
import { createAction } from 'redux-actions'

import setDefaultSafe from 'src/logic/safe/store/actions/setDefaultSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'

import { safesListSelector } from 'src/logic/safe/store/selectors'
import { SafeOwner } from 'src/logic/safe/store/models/safe'

export const ADD_SAFE = 'ADD_SAFE'

export const buildOwnersFrom = (names: string[], addresses: string[]): List<SafeOwner> => {
  const owners = names.map((name, index) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

export const addSafe = createAction(ADD_SAFE, (safe) => ({
  safe,
}))

const saveSafe = (safe: any) => (dispatch, getState) => {
  const state = getState()
  const safeList = safesListSelector(state)

  dispatch(addSafe(safe))

  if (safeList.size === 0) {
    dispatch(setDefaultSafe(safe.address))
  }
}

export default saveSafe
