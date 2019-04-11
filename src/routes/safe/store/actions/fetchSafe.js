// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import SafeRecord, { type SafeProps } from '~/routes/safe/store/model/safe'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { getOwners, getSafeName } from '~/logic/safe/utils'
import { getGnosisSafeContract } from '~/logic/contracts/safeContracts'
import { getWeb3, getBalanceInEtherOf } from '~/logic/wallets/getWeb3'

const buildOwnersFrom = (
  safeOwners: string[],
  storedOwners: Map<string, string>, // eslint-disable-next-line
) => safeOwners.map((ownerAddress: string) => {
  const ownerName = storedOwners.get(ownerAddress.toLowerCase()) || 'UNKNOWN'
  return makeOwner({ name: ownerName, address: ownerAddress })
})

export const buildSafe = async (safeAddress: string, safeName: string) => {
  const web3 = getWeb3()
  const SafeContract = await getGnosisSafeContract(web3)
  const gnosisSafe = await SafeContract.at(safeAddress)
  const ethBalance = await getBalanceInEtherOf(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), await getOwners(safeAddress)))

  const safe: SafeProps = {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
    ethBalance,
  }

  return SafeRecord(safe)
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const safeName = (await getSafeName(safeAddress)) || 'LOADED SAFE'
    const safeRecord = await buildSafe(safeAddress, safeName)

    return dispatch(updateSafe(safeRecord))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while updating safe information: ', err)

    return Promise.resolve()
  }
}
