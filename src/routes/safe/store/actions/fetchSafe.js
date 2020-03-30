// @flow
import { List } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { getLocalSafe, getSafeName } from '~/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from '~/logic/safe/utils/safeVersion'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { getBalanceInEtherOf, getWeb3 } from '~/logic/wallets/getWeb3'
import addSafe from '~/routes/safe/store/actions/addSafe'
import addSafeOwner from '~/routes/safe/store/actions/addSafeOwner'
import removeSafeOwner from '~/routes/safe/store/actions/removeSafeOwner'
import updateSafeThreshold from '~/routes/safe/store/actions/updateSafeThreshold'
import { makeOwner } from '~/routes/safe/store/models/owner'
import type { SafeProps } from '~/routes/safe/store/models/safe'
import { type GlobalState } from '~/store/index'

const buildOwnersFrom = (
  safeOwners: string[],
  localSafe: SafeProps | {}, // eslint-disable-next-line
) =>
  safeOwners.map((ownerAddress: string) => {
    if (!localSafe) {
      return makeOwner({ name: 'UNKNOWN', address: ownerAddress })
    }

    const storedOwner = localSafe.owners.find(({ address }) => sameAddress(address, ownerAddress))
    if (!storedOwner) {
      return makeOwner({ name: 'UNKNOWN', address: ownerAddress })
    }

    return makeOwner({
      name: storedOwner.name || 'UNKNOWN',
      address: ownerAddress,
    })
  })

export const buildSafe = async (safeAdd: string, safeName: string, latestMasterContractVersion: string) => {
  const safeAddress = getWeb3().utils.toChecksumAddress(safeAdd)
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const ethBalance = await getBalanceInEtherOf(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const nonce = Number(await gnosisSafe.nonce())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), await getLocalSafe(safeAddress)))
  const currentVersion = await gnosisSafe.VERSION()
  const needsUpdate = await safeNeedsUpdate(currentVersion, latestMasterContractVersion)
  const featuresEnabled = enabledFeatures(currentVersion)

  const safe: SafeProps = {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
    ethBalance,
    nonce,
    currentVersion,
    needsUpdate,
    featuresEnabled,
  }

  return safe
}

export const checkAndUpdateSafe = (safeAdd: string) => async (dispatch: ReduxDispatch<*>) => {
  const safeAddress = getWeb3().utils.toChecksumAddress(safeAdd)
  // Check if the owner's safe did change and update them
  const [gnosisSafe, localSafe] = await Promise.all([getGnosisSafeInstanceAt(safeAddress), getLocalSafe(safeAddress)])

  const remoteOwners = await gnosisSafe.getOwners()
  // Converts from [ { address, ownerName} ] to address array
  const localOwners = localSafe.owners.map(localOwner => localOwner.address)
  const localThreshold = localSafe.threshold

  // Updates threshold values
  const remoteThreshold = await gnosisSafe.getThreshold()
  localSafe.threshold = remoteThreshold.toNumber()

  if (localThreshold !== remoteThreshold.toNumber()) {
    dispatch(updateSafeThreshold({ safeAddress, threshold: remoteThreshold.toNumber() }))
  }

  // If the remote owners does not contain a local address, we remove that local owner
  localOwners.forEach(localAddress => {
    const remoteOwnerIndex = remoteOwners.findIndex(remoteAddress => sameAddress(remoteAddress, localAddress))
    if (remoteOwnerIndex === -1) {
      dispatch(removeSafeOwner({ safeAddress, ownerAddress: localAddress }))
    }
  })

  // If the remote has an owner that we don't have locally, we add it
  remoteOwners.forEach(remoteAddress => {
    const localOwnerIndex = localOwners.findIndex(localAddress => sameAddress(remoteAddress, localAddress))
    if (localOwnerIndex === -1) {
      dispatch(
        addSafeOwner({
          safeAddress,
          ownerAddress: remoteAddress,
          ownerName: 'UNKNOWN',
        }),
      )
    }
  })
}

// eslint-disable-next-line consistent-return
export default (safeAdd: string) => async (dispatch: ReduxDispatch<GlobalState>, getState: () => GlobalState) => {
  try {
    const safeAddress = getWeb3().utils.toChecksumAddress(safeAdd)
    const safeName = (await getSafeName(safeAddress)) || 'LOADED SAFE'
    const latestMasterContractVersion = getState().safes.get('latestMasterContractVersion')
    const safeProps: SafeProps = await buildSafe(safeAddress, safeName, latestMasterContractVersion)

    dispatch(addSafe(safeProps))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while updating Safe information: ', err)

    return Promise.resolve()
  }
}
