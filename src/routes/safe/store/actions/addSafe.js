// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import SafeRecord, { type Safe } from '~/routes/safe/store/models/safe'
import { makeOwner, type Owner } from '~/routes/safe/store/models/owner'

export const ADD_SAFE = 'ADD_SAFE'

export const buildOwnersFrom = (names: Array<string>, addresses: Array<string>) => {
  const owners = names.map((name: string, index: number) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

type ActionReturn = {
  safe: Safe,
}

export const addSafe = createAction<string, Function, ActionReturn>(
  ADD_SAFE,
  (safe: Safe): ActionReturn => ({
    safe,
  }),
)

const saveSafe = (name: string, address: string, threshold: number, ownersName: string[], ownersAddress: string[]) => (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  const owners: List<Owner> = buildOwnersFrom(ownersName, ownersAddress)

  const safe: Safe = SafeRecord({
    name,
    address,
    threshold,
    owners,
  })

  dispatch(addSafe(safe))
}

export default saveSafe
