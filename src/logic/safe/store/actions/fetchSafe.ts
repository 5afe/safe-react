import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { List, Set, Map } from 'immutable'
import { Action, Dispatch } from 'redux'
import { AbiItem } from 'web3-utils'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getLocalSafe, getSafeName } from 'src/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import addSafeOwner from 'src/logic/safe/store/actions/addSafeOwner'
import removeSafeOwner from 'src/logic/safe/store/actions/removeSafeOwner'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SafeOwner, SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { AppReduxState } from 'src/store'
import { latestMasterContractVersionSelector } from 'src/logic/safe/store/selectors'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import { getModules } from 'src/logic/safe/utils/modules'

const buildOwnersFrom = (safeOwners: string[], localSafe?: SafeRecordProps): List<SafeOwner> => {
  const ownersList = safeOwners.map((ownerAddress) => {
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

  return List(ownersList)
}

export const buildSafe = async (
  safeAdd: string,
  safeName: string,
  latestMasterContractVersion?: string,
): Promise<SafeRecordProps> => {
  const safeAddress = checksumAddress(safeAdd)

  const safeParams = ['getThreshold', 'nonce', 'VERSION', 'getOwners']
  const [
    [, thresholdStr, nonceStr, currentVersion, remoteOwners = []],
    safeInfo,
    localSafe,
    ethBalance,
  ] = await Promise.all([
    generateBatchRequests<[undefined, string | undefined, string | undefined, string | undefined, string[]]>({
      abi: GnosisSafeSol.abi as AbiItem[],
      address: safeAddress,
      methods: safeParams,
    }),
    getSafeInfo(safeAddress),
    getLocalSafe(safeAddress),
    getBalanceInEtherOf(safeAddress),
  ])

  const threshold = Number(thresholdStr)
  const nonce = Number(nonceStr)
  const owners = buildOwnersFrom(remoteOwners, localSafe)
  const needsUpdate = safeNeedsUpdate(currentVersion, latestMasterContractVersion)
  const featuresEnabled = enabledFeatures(currentVersion)
  const modules = await getModules(safeInfo)

  return {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
    ethBalance,
    nonce,
    currentVersion: currentVersion ?? '',
    needsUpdate,
    featuresEnabled,
    balances: localSafe?.balances || Map(),
    latestIncomingTxBlock: 0,
    activeAssets: Set(),
    activeTokens: Set(),
    blacklistedAssets: Set(),
    blacklistedTokens: Set(),
    modules,
  }
}

export const checkAndUpdateSafe = (safeAdd: string) => async (dispatch: Dispatch): Promise<void> => {
  const safeAddress = checksumAddress(safeAdd)
  // Check if the owner's safe did change and update them
  const safeParams = ['getThreshold', 'nonce', 'getOwners']
  const [[, remoteThreshold, remoteNonce, remoteOwners = []], safeInfo, localSafe] = await Promise.all([
    generateBatchRequests<[undefined, string | undefined, string | undefined, string[]]>({
      abi: GnosisSafeSol.abi as AbiItem[],
      address: safeAddress,
      methods: safeParams,
    }),
    getSafeInfo(safeAddress),
    getLocalSafe(safeAddress),
  ])

  // Converts from [ { address, ownerName} ] to address array
  const localOwners = localSafe ? localSafe.owners.map((localOwner) => localOwner.address) : []

  const modules = await getModules(safeInfo)

  dispatch(
    updateSafe({
      address: safeAddress,
      name: localSafe?.name,
      modules,
      nonce: Number(remoteNonce),
      threshold: Number(remoteThreshold),
      featuresEnabled: localSafe?.currentVersion
        ? enabledFeatures(localSafe?.currentVersion)
        : localSafe?.featuresEnabled,
    }),
  )

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
export default (safeAdd: string) => async (
  dispatch: Dispatch<any>,
  getState: () => AppReduxState,
): Promise<Action | void> => {
  try {
    const safeAddress = checksumAddress(safeAdd)
    const safeName = (await getSafeName(safeAddress)) || 'LOADED SAFE'
    const latestMasterContractVersion = latestMasterContractVersionSelector(getState())
    const safeProps = await buildSafe(safeAddress, safeName, latestMasterContractVersion)

    // `updateSafe`, as `loadSafesFromStorage` will populate the store previous to this call
    // and `addSafe` will only add a newly non-existent safe
    // For the case where the safe does not exist in the localStorage,
    // `updateSafe` uses a default `notSetValue` to add the Safe to the store
    dispatch(updateSafe(safeProps))
  } catch (err) {
    console.error('Error while updating Safe information: ', err)

    return Promise.resolve()
  }
}
