import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { List, Set, Map } from 'immutable'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getLocalSafe, getSafeName } from 'src/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import addSafe from 'src/logic/safe/store/actions/addSafe'
import addSafeOwner from 'src/logic/safe/store/actions/addSafeOwner'
import removeSafeOwner from 'src/logic/safe/store/actions/removeSafeOwner'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import {
  requestAllowancesByDelegatesAndTokens,
  requestTokensByDelegate,
} from 'src/routes/safe/components/Settings/SpendingLimit/utils'

import { checksumAddress } from 'src/utils/checksumAddress'
import { ModulePair, SafeOwner, SafeRecordProps, SpendingLimit } from 'src/logic/safe/store/models/safe'
import { Action, Dispatch } from 'redux'
import { getSpendingLimitContract, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { AppReduxState } from 'src/store'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

const buildOwnersFrom = (safeOwners: string[], localSafe: SafeRecordProps): List<SafeOwner> => {
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

const buildModulesLinkedList = (modules: string[] | undefined, nextModule: string): Array<ModulePair> | null => {
  if (modules?.length) {
    return modules.map((moduleAddress, index, modules) => {
      const prevModule = modules[index + 1]
      return [moduleAddress, prevModule !== undefined ? prevModule : nextModule]
    })
  }
  return null
}

export const buildSafe = async (
  safeAdd: string,
  safeName: string,
  latestMasterContractVersion?: string,
): Promise<SafeRecordProps> => {
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
  const owners = buildOwnersFrom(remoteOwners, localSafe)
  const needsUpdate = safeNeedsUpdate(currentVersion, latestMasterContractVersion)
  const featuresEnabled = enabledFeatures(currentVersion)

  return {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
    ethBalance,
    nonce,
    currentVersion,
    needsUpdate,
    featuresEnabled,
    spendingLimits: null,
    balances: Map(),
    latestIncomingTxBlock: null,
    activeAssets: Set(),
    activeTokens: Set(),
    blacklistedAssets: Set(),
    blacklistedTokens: Set(),
    modules: null,
  }
}

const getSpendingLimits = async (modules, safeAddress: string): Promise<SpendingLimit[] | null> => {
  const isSpendingLimitEnabled =
    modules?.array?.some((module) => module.toLowerCase() === SPENDING_LIMIT_MODULE_ADDRESS.toLowerCase()) ?? false

  if (isSpendingLimitEnabled) {
    const delegates = await getSpendingLimitContract().methods.getDelegates(safeAddress, 0, 100).call()
    const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results)
    return requestAllowancesByDelegatesAndTokens(safeAddress, tokensByDelegate)
  }

  return null
}

export const checkAndUpdateSafe = (safeAdd: string) => async (dispatch: Dispatch): Promise<void> => {
  const safeAddress = checksumAddress(safeAdd)

  // Check if the owner's safe did change and update them
  const safeParams = [
    'getThreshold',
    'nonce',
    'getOwners',
    // TODO: 100 is an arbitrary large number, to avoid the need for pagination. But pagination must be properly handled
    { method: 'getModulesPaginated', args: [SENTINEL_ADDRESS, 100] },
  ]

  const safeInfo = generateBatchRequests({
    abi: GnosisSafeSol.abi,
    address: safeAddress,
    methods: safeParams,
  })

  const [[remoteThreshold, remoteNonce, remoteOwners, modules], localSafe] = await Promise.all([
    safeInfo,
    getLocalSafe(safeAddress),
  ])

  // request SpendingLimit info
  const spendingLimits = await getSpendingLimits(modules, safeAddress)

  // Converts from [ { address, ownerName} ] to address array
  const localOwners = localSafe ? localSafe.owners.map((localOwner) => localOwner.address) : undefined

  dispatch(
    updateSafe({
      address: safeAddress,
      modules: buildModulesLinkedList(modules?.array, modules?.next),
      spendingLimits,
      nonce: Number(remoteNonce),
      threshold: Number(remoteThreshold),
    }),
  )

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

export default (safeAdd: string) => async (
  dispatch: Dispatch<any>,
  getState: () => AppReduxState,
): Promise<Action | void> => {
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
