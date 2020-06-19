import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { List } from 'immutable'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getLocalSafe, getSafeName } from 'src/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import addSafe from 'src/routes/safe/store/actions/addSafe'
import addSafeOwner from 'src/routes/safe/store/actions/addSafeOwner'
import removeSafeOwner from 'src/routes/safe/store/actions/removeSafeOwner'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { makeOwner } from 'src/routes/safe/store/models/owner'

import { checksumAddress } from 'src/utils/checksumAddress'
import { SafeOwner } from '../models/safe'

const buildOwnersFrom = (
  safeOwners,
  localSafe, // eslint-disable-next-line
) =>
  safeOwners.map((ownerAddress) => {
    const convertedAdd = checksumAddress(ownerAddress)
    if (!localSafe) {
      return makeOwner({ name: 'UNKNOWN', address: convertedAdd })
    }

    const storedOwner = localSafe.owners.find(({ address }) => sameAddress(address, convertedAdd))
    if (!storedOwner) {
      return makeOwner({ name: 'UNKNOWN', address: convertedAdd })
    }

    return makeOwner({
      name: storedOwner.name || 'UNKNOWN',
      address: convertedAdd,
    })
  })

export const buildSafe = async (safeAdd, safeName, latestMasterContractVersion?: any) => {
  const safeAddress = checksumAddress(safeAdd)

  const safeParams = ['getThreshold', 'nonce', 'VERSION', 'getOwners']
  const [[thresholdStr, nonceStr, currentVersion, remoteOwners], localSafe, ethBalance] = await Promise.all([
    generateBatchRequests({
      abi: GnosisSafeSol.abi,
      address: safeAddress,
      methods: safeParams,
    } as any),
    getLocalSafe(safeAddress),
    getBalanceInEtherOf(safeAddress),
  ])

  const threshold = Number(thresholdStr)
  const nonce = Number(nonceStr)
  const owners = List<SafeOwner>(buildOwnersFrom(remoteOwners, localSafe))
  const needsUpdate = safeNeedsUpdate(currentVersion, latestMasterContractVersion)
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
  const safeAddress = checksumAddress(safeAdd)
  // Check if the owner's safe did change and update them
  const safeParams = ['getThreshold', 'nonce', 'getOwners']
  const [[remoteThreshold, remoteNonce, remoteOwners], localSafe] = await Promise.all([
    generateBatchRequests({
      abi: GnosisSafeSol.abi,
      address: safeAddress,
      methods: safeParams,
    } as any),
    getLocalSafe(safeAddress),
  ])

  // Converts from [ { address, ownerName} ] to address array
  const localOwners = localSafe ? localSafe.owners.map((localOwner) => localOwner.address) : undefined
  const localThreshold = localSafe ? localSafe.threshold : undefined
  const localNonce = localSafe ? localSafe.nonce : undefined

  if (localNonce !== Number(remoteNonce)) {
    dispatch(updateSafe({ address: safeAddress, nonce: Number(remoteNonce) }))
  }

  if (localThreshold !== Number(remoteThreshold)) {
    dispatch(updateSafe({ address: safeAddress, threshold: Number(remoteThreshold) }))
  }

  // If the remote owners does not contain a local address, we remove that local owner
  if (localOwners) {
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
}

// eslint-disable-next-line consistent-return
export default (safeAdd) => async (dispatch, getState) => {
  try {
    const safeAddress = checksumAddress(safeAdd)
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
