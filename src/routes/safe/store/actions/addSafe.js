// @flow
import { List } from 'immutable'
import { createAction } from 'redux-actions'
import { makeDailyLimit, type DailyLimit } from '~/routes/safe/store/model/dailyLimit'
import { type SafeProps } from '~/routes/safe/store/model/safe'
import { makeOwner, type Owner } from '~/routes/safe/store/model/owner'

export const ADD_SAFE = 'ADD_SAFE'

export const buildOwnersFrom = (names: string[], addresses: string[]) => {
  const owners = names.map((name: string, index: number) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

export const buildDailyLimitFrom = (dailyLimit: number, spentToday: number = 0): DailyLimit =>
  makeDailyLimit({ value: dailyLimit, spentToday })

const addSafe = createAction(
  ADD_SAFE,
  (
    name: string, address: string,
    confirmations: number, limit: number,
    ownersName: string[], ownersAddress: string[],
  ): SafeProps => {
    const owners: List<Owner> = buildOwnersFrom(ownersName, ownersAddress)
    const dailyLimit: DailyLimit = buildDailyLimitFrom(limit)

    return ({
      address, name, confirmations, owners, dailyLimit,
    })
  },
)

export default addSafe
