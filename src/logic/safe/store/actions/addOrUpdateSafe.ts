import { createAction } from 'redux-actions'

import { SafeOwner, SafeRecordProps } from '../models/safe'
import { List } from 'immutable'
import { makeOwner } from '../models/owner'

export const ADD_OR_UPDATE_SAFE = 'ADD_OR_UPDATE_SAFE'

export const buildOwnersFrom = (names: string[], addresses: string[]): List<SafeOwner> => {
  const owners = names.map((name, index) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

export const addOrUpdateSafe = createAction(ADD_OR_UPDATE_SAFE, (safe: SafeRecordProps, loadedFromStorage = false) => ({
  safe,
  loadedFromStorage,
}))
