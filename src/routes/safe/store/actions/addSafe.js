// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import { type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { saveSafes, setOwners } from '~/utils/localStorage'
import { makeOwner, type Owner } from '~/routes/safe/store/model/owner'

export const ADD_SAFE = 'ADD_SAFE'

export const buildOwnersFrom = (names: Array<string>, addresses: Array<string>) => {
  const owners = names.map((name: string, index: number) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

type ActionReturn = {
  safe: Safe,
}

const addSafe = createAction<string, *, *>(
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
) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const owners: List<Owner> = buildOwnersFrom(ownersName, ownersAddress)

  const safe: Safe = makeSafe({
    name,
    address,
    threshold,
    owners,
  })
  setOwners(safe.address, safe.owners)
  saveSafes(safes.toJSON())
}

export default addSafe
