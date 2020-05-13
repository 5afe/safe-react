// @flow
import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { List } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import generateBatchRequests from '~/logic/contracts/generateBatchRequests'
import { getLocalSafe, getSafeName } from '~/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from '~/logic/safe/utils/safeVersion'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'
import addSafe from '~/routes/safe/store/actions/addSafe'
import addSafeOwner from '~/routes/safe/store/actions/addSafeOwner'
import removeSafeOwner from '~/routes/safe/store/actions/removeSafeOwner'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { makeOwner } from '~/routes/safe/store/models/owner'
import type { SafeProps } from '~/routes/safe/store/models/safe'
import { type GlobalState } from '~/store'
import { checksumAddress } from '~/utils/checksumAddress'

const buildOwnersFrom = (
  safeOwners: string[],
  localSafe: SafeProps | {}, // eslint-disable-next-line
) =>
  safeOwners.map((ownerAddress: string) => {
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

export const buildSafe = async (safeAdd: string, safeName: string, latestMasterContractVersion: string) => {
  const safeAddress = checksumAddress(safeAdd)

  const safeParams = ['getThreshold', 'nonce', 'VERSION', 'getOwners']
  const [[thresholdStr, nonceStr, currentVersion, remoteOwners], localSafe, ethBalance] = await Promise.all([
    generateBatchRequests({
      abi: GnosisSafeSol.abi,
      address: safeAddress,
      methods: safeParams,
    }),
    getLocalSafe(safeAddress),
    getBalanceInEtherOf(safeAddress),
  ])

  const threshold = Number(thresholdStr)
  const nonce = Number(nonceStr)
  const owners = List(buildOwnersFrom(remoteOwners, localSafe))
  const needsUpdate = safeNeedsUpdate(currentVersion, latestMasterContractVersion)
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
  const safeAddress = checksumAddress(safeAdd)
  // Check if the owner's safe did change and update them
  const safeParams = ['getThreshold', 'nonce', 'getOwners']
  const [[remoteThreshold, remoteNonce, remoteOwners], localSafe] = await Promise.all([
    generateBatchRequests({
      abi: GnosisSafeSol.abi,
      address: safeAddress,
      methods: safeParams,
    }),
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
export default (safeAdd: string) => async (dispatch: ReduxDispatch<GlobalState>, getState: () => GlobalState) => {
  try {
    const safeAddress = checksumAddress(safeAdd)
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
