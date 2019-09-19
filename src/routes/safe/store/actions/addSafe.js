// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type GlobalState } from '~/store'
import { safesListSelector } from '~/routes/safeList/store/selectors'
import SafeRecord, { type Safe } from '~/routes/safe/store/models/safe'
import { makeOwner, type Owner } from '~/routes/safe/store/models/owner'
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

const saveSafe = (name: string, address: string, threshold: number, ownersName: string[], ownersAddress: string[]) => (
  dispatch: ReduxDispatch<GlobalState>,
  getState: GetState<GlobalState>,
) => {
  const owners: List<Owner> = buildOwnersFrom(ownersName, ownersAddress)
  const state = getState()
  const safeList = safesListSelector(state)

  const safe: Safe = SafeRecord({
    name,
    address,
    threshold,
    owners,
  })

  dispatch(addSafe(safe))
  console.log(safeList.size)
  if (safeList.size === 0) {
    setDefaultSafe(address)
  }
}

export default saveSafe
