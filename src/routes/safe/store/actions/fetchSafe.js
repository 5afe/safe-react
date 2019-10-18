// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/models/owner'
import type { SafeProps } from '~/routes/safe/store/models/safe'
import addSafe from '~/routes/safe/store/actions/addSafe'
import { getOwners, getSafeName } from '~/logic/safe/utils'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import Web3Integration from '~/logic/wallets/web3Integration'

const buildOwnersFrom = (
  safeOwners: string[],
  storedOwners: Map<string, string>, // eslint-disable-next-line
) => safeOwners.map((ownerAddress: string) => {
  const ownerName = storedOwners.get(ownerAddress.toLowerCase()) || 'UNKNOWN'
  return makeOwner({ name: ownerName, address: ownerAddress })
})

export const buildSafe = async (safeAddress: string, safeName: string) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const ethBalance = await Web3Integration.getBalanceInEtherOf(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), await getOwners(safeAddress)))

  const safe: SafeProps = {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
    ethBalance,
  }

  return safe
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const safeName = (await getSafeName(safeAddress)) || 'LOADED SAFE'
    const safeProps: SafeProps = await buildSafe(safeAddress, safeName)

    dispatch(addSafe(safeProps))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while updating Safe information: ', err)

    return Promise.resolve()
  }
}
