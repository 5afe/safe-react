// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import SafeRecord, { type Safe } from '~/routes/safe/store/models/safe'
import { saveSafes, setOwners } from '~/logic/safe/utils'
import { makeOwner, type Owner } from '~/routes/safe/store/models/owner'
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type GlobalState } from '~/store/index'
import { safesMapSelector } from '~/routes/safeList/store/selectors/index'

export const ADD_SAFE = 'ADD_SAFE'

export const buildOwnersFrom = (names: Array<string>, addresses: Array<string>) => {
  const owners = names.map((name: string, index: number) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

type ActionReturn = {
  safe: Safe,
}

export const addSafe = createAction<string, *, *>(
  ADD_SAFE,
  (safe: Safe): ActionReturn => ({
    safe,
  }),
)

const saveSafe = (
  name: string,
  address: string,
  threshold: number,
  ownersName: string[],
  ownersAddress: string[],
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const owners: List<Owner> = buildOwnersFrom(ownersName, ownersAddress)
  const state: GlobalState = getState()

  const safe: Safe = SafeRecord({
    name,
    address,
    threshold,
    owners,
  })
  const safes = safesMapSelector(state)
  const newSafes = safes.set(address, safe)

  setOwners(address, owners)
  saveSafes(newSafes.toJSON())

  dispatch(addSafe(safe))
}

export default saveSafe
