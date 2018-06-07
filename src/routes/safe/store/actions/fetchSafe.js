// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type SafeProps, type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { makeDailyLimit } from '~/routes/safe/store/model/dailyLimit'
import { getDailyLimitFrom } from '~/routes/safe/component/Withdrawn/withdrawn'
import { getGnosisSafeInstanceAt } from '~/wallets/safeContracts'
import updateSafe from '~/routes/safe/store/actions/updateSafe'

const buildOwnersFrom = (safeOwners: string[], storedOwners: Object[]) => (
  safeOwners.map((ownerAddress: string) => {
    const foundOwner = storedOwners.find(owner => owner.address === ownerAddress)
    return makeOwner(foundOwner || { name: 'UNKNOWN', address: ownerAddress })
  })
)

export const buildSafe = async (storedSafe: Object) => {
  const safeAddress = storedSafe.address
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)

  const dailyLimit = makeDailyLimit(await getDailyLimitFrom(safeAddress, 0))
  const threshold = Number(await gnosisSafe.getThreshold())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), storedSafe.owners))

  const safe: SafeProps = {
    address: safeAddress,
    dailyLimit,
    name: storedSafe.name,
    threshold,
    owners,
  }

  return makeSafe(safe)
}

export default (safe: Safe) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const safeRecord = await buildSafe(safe.toJSON())

  return dispatch(updateSafe(safeRecord))
}
