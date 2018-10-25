// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type SafeProps, type Safe, makeSafe } from '~/routes/safe/store/model/safe'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { getOwners } from '~/utils/localStorage'
import { getGnosisSafeContract } from '~/logic/contracts/safeContracts'
import { getWeb3 } from '~/logic/wallets/getWeb3'

const buildOwnersFrom = (safeOwners: string[], storedOwners: Map<string, string>) => (
  safeOwners.map((ownerAddress: string) => {
    const ownerName = storedOwners.get(ownerAddress.toLowerCase()) || 'UNKNOWN'
    return makeOwner({ name: ownerName, address: ownerAddress })
  })
)

export const buildSafe = async (storedSafe: Object) => {
  const safeAddress = storedSafe.address
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = GnosisSafe.at(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), getOwners(safeAddress)))

  const safe: SafeProps = {
    address: safeAddress,
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
