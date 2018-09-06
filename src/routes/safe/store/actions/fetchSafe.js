// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type SafeProps, type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { makeDailyLimit } from '~/routes/safe/store/model/dailyLimit'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { getOwners } from '~/utils/localStorage'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { getDailyLimitFrom } from '~/logic/contracts/dailyLimitContracts'

const buildOwnersFrom = (safeOwners: string[], storedOwners: Map<string, string>) => (
  safeOwners.map((ownerAddress: string) => {
    const ownerName = storedOwners.get(ownerAddress.toLowerCase()) || 'UNKNOWN'
    return makeOwner({ name: ownerName, address: ownerAddress })
  })
)

export const buildSafe = async (storedSafe: Object) => {
  const safeAddress = storedSafe.address
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)

  const dailyLimit = makeDailyLimit(await getDailyLimitFrom(safeAddress, 0))
  const threshold = Number(await gnosisSafe.getThreshold())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), getOwners(safeAddress)))

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
  try {
    const safeRecord = await buildSafe(safe.toJSON())

    return dispatch(updateSafe(safeRecord))
  } catch (err) {
    // eslint-disable-next-line
    console.log("Error while updating safe information")

    return Promise.resolve()
  }
}
