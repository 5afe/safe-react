// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import { type SafeProps } from '~/routes/safe/store/model/safe'
import { makeOwner, type Owner } from '~/routes/safe/store/model/owner'

export const ADD_SAFE = 'ADD_PROVIDER'

export const buildOwnersFrom = (names: string[], addresses: string[]) => {
  const owners = names.map((name: string, index: number) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

const addSafe = createAction(
  ADD_SAFE,
  (
    name: string, address: string, confirmations: number,
    ownersName: string[], ownersAddress: string[],
  ): SafeProps => {
    const owners: List<Owner> = buildOwnersFrom(ownersName, ownersAddress)

    return ({
      address, name, confirmations, owners,
    })
  },
)

export default addSafe
