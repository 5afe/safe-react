// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/models/owner'
import type { SafeProps } from '~/routes/safe/store/models/safe'
import addSafe from '~/routes/safe/store/actions/addSafe'
import { getOwners, getSafeName, SAFES_KEY } from '~/logic/safe/utils'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import { loadFromStorage } from '~/utils/storage'
import updateSafe from '~/routes/safe/store/actions/updateSafe'

const buildOwnersFrom = (
  safeOwners: string[],
  storedOwners: Map<string, string>, // eslint-disable-next-line
) => safeOwners.map((ownerAddress: string) => {
  const ownerName = storedOwners.get(ownerAddress.toLowerCase()) || 'UNKNOWN'
  return makeOwner({ name: ownerName, address: ownerAddress })
})

export const buildSafe = async (safeAddress: string, safeName: string) => {
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
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

  return safe
}

const getLocalSafe = async (safeAddress: string) => {
  const storedSafes = (await loadFromStorage(SAFES_KEY)) || {}
  return storedSafes[safeAddress]
}

export const checkAndUpdateSafeOwners = (safeAddress: string) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  // Check if the owner's safe did change and update them
  const [gnosisSafe, localSafe] = await Promise.all([getGnosisSafeInstanceAt(safeAddress), getLocalSafe(safeAddress)])
  const remoteOwners = await gnosisSafe.getOwners()
  const localOwners = localSafe.owners.map((localOwner) => localOwner.address)

  if (remoteOwners.length !== localOwners.length) {
    dispatch(updateSafe({ address: safeAddress, owners: remoteOwners }))
    return
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const remoteIterator of remoteOwners) {
    if (!localOwners.includes(remoteIterator)) {
      dispatch(updateSafe({ address: safeAddress, owners: remoteOwners }))

      return
    }
  }
}

// eslint-disable-next-line consistent-return
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
