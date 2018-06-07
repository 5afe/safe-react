// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type SafeProps, type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import { makeDailyLimit } from '~/routes/safe/store/model/dailyLimit'
import { getDailyLimitFrom } from '~/routes/safe/component/Withdrawn/withdrawn'
import { getGnosisSafeInstanceAt } from '~/wallets/safeContracts'
import { load, SAFES_KEY } from '~/utils/localStorage'
import updateSafes from '~/routes/safe/store/actions/updateSafes'

const buildOwnersFrom = (safeOwners: string[], storedOwners: Object[]) => (
  safeOwners.map((ownerAddress: string) => {
    const foundOwner = storedOwners.find(owner => owner.address === ownerAddress)
    return makeOwner(foundOwner || { name: 'UNKNOWN', address: ownerAddress })
  })
)

const buildSafe = async (storedSafe: Object) => {
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

const buildSafesFrom = async (loadedSafes: Object): Promise<Map<string, Safe>> => {
  const safes = Map()

  const keys = Object.keys(loadedSafes)
  const safeRecords = await Promise.all(keys.map((address: string) => buildSafe(loadedSafes[address])))

  return safes.withMutations(async (map) => {
    safeRecords.forEach((safe: Safe) => map.set(safe.get('address'), safe))
  })
}

export default () => async (dispatch: ReduxDispatch<GlobalState>) => {
  const storedSafes = load(SAFES_KEY)
  const safes = storedSafes ? await buildSafesFrom(storedSafes) : Map()

  return dispatch(updateSafes(safes))
}
