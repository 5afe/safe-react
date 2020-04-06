// 
import { List } from 'immutable'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getLocalSafe, getSafeName } from 'src/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getBalanceInEtherOf, getWeb3 } from 'src/logic/wallets/getWeb3'
import addSafe from 'src/routes/safe/store/actions/addSafe'
import addSafeOwner from 'src/routes/safe/store/actions/addSafeOwner'
import removeSafeOwner from 'src/routes/safe/store/actions/removeSafeOwner'
import updateSafeThreshold from 'src/routes/safe/store/actions/updateSafeThreshold'
import { makeOwner } from 'src/routes/safe/store/models/owner'
import { } from 'src/store/index'

const buildOwnersFrom = (
  safeOwners,
  localSafe, // eslint-disable-next-line
) =>
  safeOwners.map((ownerAddress) => {
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

export const buildSafe = async (safeAdd, safeName, latestMasterContractVersion) => {
  const safeAddress = getWeb3().utils.toChecksumAddress(safeAdd)
  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const ethBalance = await getBalanceInEtherOf(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const nonce = Number(await gnosisSafe.nonce())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), await getLocalSafe(safeAddress)))
  const currentVersion = await gnosisSafe.VERSION()
  const needsUpdate = await safeNeedsUpdate(currentVersion, latestMasterContractVersion)
  const featuresEnabled = enabledFeatures(currentVersion)

  const safe = {
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

export const checkAndUpdateSafe = (safeAdd) => async (dispatch) => {
  const safeAddress = getWeb3().utils.toChecksumAddress(safeAdd)
  // Check if the owner's safe did change and update them
  const [gnosisSafe, localSafe] = await Promise.all([getGnosisSafeInstanceAt(safeAddress), getLocalSafe(safeAddress)])

  const remoteOwners = await gnosisSafe.getOwners()
  // Converts from [ { address, ownerName} ] to address array
  const localOwners = localSafe.owners.map((localOwner) => localOwner.address)
  const localThreshold = localSafe.threshold

  // Updates threshold values
  const remoteThreshold = await gnosisSafe.getThreshold()
  localSafe.threshold = remoteThreshold.toNumber()

  if (localThreshold !== remoteThreshold.toNumber()) {
    dispatch(updateSafeThreshold({ safeAddress, threshold: remoteThreshold.toNumber() }))
  }

  // If the remote owners does not contain a local address, we remove that local owner
  localOwners.forEach((localAddress) => {
    const remoteOwnerIndex = remoteOwners.findIndex((remoteAddress) => sameAddress(remoteAddress, localAddress))
    if (remoteOwnerIndex === -1) {
      dispatch(removeSafeOwner({ safeAddress, ownerAddress: localAddress }))
    }
  })

  // If the remote has an owner that we don't have locally, we add it
  remoteOwners.forEach((remoteAddress) => {
    const localOwnerIndex = localOwners.findIndex((localAddress) => sameAddress(remoteAddress, localAddress))
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
export default (safeAdd) => async (dispatch, getState) => {
  try {
    const safeAddress = getWeb3().utils.toChecksumAddress(safeAdd)
    const safeName = (await getSafeName(safeAddress)) || 'LOADED SAFE'
    const latestMasterContractVersion = getState().safes.get('latestMasterContractVersion')
    const safeProps = await buildSafe(safeAddress, safeName, latestMasterContractVersion)

    dispatch(addSafe(safeProps))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while updating Safe information: ', err)

    return Promise.resolve()
  }
}
