import { List } from 'immutable'
import { Dispatch } from 'redux'

import { BalanceEndpoint, fetchTokenCurrenciesBalances } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'
import { getLocalSafe } from 'src/logic/safe/utils'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { addSafeOwner } from 'src/logic/safe/store/actions/addSafeOwner'
import { removeSafeOwner } from 'src/logic/safe/store/actions/removeSafeOwner'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import { checksumAddress } from 'src/utils/checksumAddress'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getSafeInfo, SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { getModules } from 'src/logic/safe/utils/modules'
import { getSpendingLimits } from 'src/logic/safe/utils/spendingLimits'

const extractSafeNativeBalance = (safeBalancesSettled: PromiseSettledResult<BalanceEndpoint>): string => {
  let nativeCoinBalance = '0'
  if (safeBalancesSettled.status === 'fulfilled') {
    const safeBalances = safeBalancesSettled.value
    const nativeCoin = safeBalances.items.find(({ tokenInfo }) => sameAddress(tokenInfo.address, ZERO_ADDRESS))

    if (nativeCoin) {
      nativeCoinBalance = fromTokenUnit(nativeCoin.balance, nativeCoin.tokenInfo.decimals)
    }
  } else {
    console.error('Failed to load Native coin balance information', safeBalancesSettled.reason)
  }

  return nativeCoinBalance
}

const extractRemoteSafeInfo = async (
  remoteSafeInfoSettled: PromiseSettledResult<SafeInfo>,
  checksummedSafeAddress: string,
): Promise<Partial<SafeRecordProps>> => {
  const safeInfo: Partial<SafeRecordProps> = {}

  if (remoteSafeInfoSettled.status === 'fulfilled') {
    const remoteSafeInfo = remoteSafeInfoSettled.value
    const safeInfoModules = remoteSafeInfo.modules.map(({ value }) => value)

    const [spendingLimitsSettled, modulesSettled] = await Promise.allSettled([
      // request SpendingLimit info
      getSpendingLimits(safeInfoModules, checksummedSafeAddress),
      // request Modules info
      getModules(remoteSafeInfo),
    ])

    if (spendingLimitsSettled.status === 'fulfilled') {
      safeInfo.spendingLimits = spendingLimitsSettled.value
    } else {
      console.error('Failed to load Spending Limits information', spendingLimitsSettled.reason)
    }

    if (modulesSettled.status === 'fulfilled') {
      safeInfo.modules = modulesSettled.value
    } else {
      console.error('Failed to load Modules information', modulesSettled.reason)
    }

    safeInfo.nonce = remoteSafeInfo.nonce
    safeInfo.threshold = remoteSafeInfo.threshold
    safeInfo.currentVersion = remoteSafeInfo.version
    safeInfo.needsUpdate = safeNeedsUpdate(safeInfo.currentVersion, '1.1.1')
    safeInfo.featuresEnabled = enabledFeatures(safeInfo.currentVersion)
  } else {
    console.error('Failed to load Safe information from client-gateway', remoteSafeInfoSettled.reason)
  }

  return safeInfo
}

const extractLocalSafeInfo = (
  localSafeInfoSettled: PromiseSettledResult<SafeRecordProps | undefined>,
  remoteSafeInfoRetrievedSuccessfully: boolean,
): Partial<SafeRecordProps> => {
  const safeInfo: Partial<SafeRecordProps> = {}

  if (localSafeInfoSettled.status === 'fulfilled') {
    if (localSafeInfoSettled.value !== undefined) {
      const localSafeInfo = localSafeInfoSettled.value

      if (!remoteSafeInfoRetrievedSuccessfully) {
        // if for any reason we failed to retrieve safe's remote information,
        // we default to what we had locally stored
        safeInfo.nonce = localSafeInfo.nonce
        safeInfo.threshold = localSafeInfo.threshold
        safeInfo.currentVersion = localSafeInfo.currentVersion
        safeInfo.needsUpdate = localSafeInfo.needsUpdate
        safeInfo.featuresEnabled = localSafeInfo.featuresEnabled
        safeInfo.spendingLimits = localSafeInfo.spendingLimits
        safeInfo.modules = localSafeInfo.modules
      }

      safeInfo.owners = List(localSafeInfo.owners)
      safeInfo.name = localSafeInfo.name
    }
  } else {
    console.error('Failed to load locally stored Safe information', localSafeInfoSettled.reason)
  }

  return safeInfo
}

const updateSafeOwners = (
  remoteSafeInfoSettled: PromiseSettledResult<SafeInfo>,
  localSafeInfoSettled: PromiseSettledResult<SafeRecordProps | undefined>,
  checksummedSafeAddress: string,
  dispatch: Dispatch,
): void => {
  let remoteOwners
  let localOwners = List()

  if (remoteSafeInfoSettled.status === 'fulfilled') {
    const remoteSafeInfo = remoteSafeInfoSettled.value

    remoteOwners = List(
      remoteSafeInfo.owners.map(({ value }) => makeOwner({ name: 'UNKNOWN', address: checksumAddress(value) })),
    )
  } else {
    // nothing to do without remote owners
    return
  }

  if (localSafeInfoSettled.status === 'fulfilled' && localSafeInfoSettled.value !== undefined) {
    const localSafeInfo = localSafeInfoSettled.value

    localOwners = localSafeInfo.owners
  }

  // If the remote owners does not contain a local address, we remove that local owner
  localOwners.forEach(({ address }) => {
    const remoteOwnerIndex = remoteOwners.findIndex((remote) => sameAddress(remote.address, address))
    if (remoteOwnerIndex === -1) {
      dispatch(removeSafeOwner({ safeAddress: checksummedSafeAddress, ownerAddress: address }))
    }
  })

  // If the remote has an owner that we don't have locally, we add it
  remoteOwners.forEach(({ address, name }) => {
    const localOwnerIndex = localOwners.findIndex((local) => sameAddress(address, local.address))
    if (localOwnerIndex === -1) {
      dispatch(
        addSafeOwner({
          safeAddress: checksummedSafeAddress,
          ownerAddress: address,
          ownerName: name,
        }),
      )
    }
  })
}

export const buildSafe = async (safeAddress: string, safeName: string): Promise<SafeRecordProps> => {
  const checksummedSafeAddress = checksumAddress(safeAddress)
  const safeInfo: Partial<SafeRecordProps> = {
    address: checksummedSafeAddress,
    name: safeName,
  }

  const [remoteSafeInfoSettled, localSafeInfoSettled, safeBalancesSettled] = await Promise.allSettled([
    getSafeInfo(safeAddress),
    getLocalSafe(safeAddress),
    fetchTokenCurrenciesBalances({ safeAddress, selectedCurrency: 'UDS' }),
  ])

  // remote (client-gateway)
  const remoteSafeInfo = await extractRemoteSafeInfo(remoteSafeInfoSettled, checksummedSafeAddress)

  // local (localStorage)
  const localSafeInfo = await extractLocalSafeInfo(localSafeInfoSettled, remoteSafeInfoSettled.status === 'fulfilled')

  // remote (client-gateway)
  // TODO: REVIEW: do we really need to load ethBalance?
  //  it's being loaded by the `fetchSafeTokens` action anyway
  safeInfo.ethBalance = extractSafeNativeBalance(safeBalancesSettled)

  return { ...safeInfo, ...remoteSafeInfo, ...localSafeInfo } as SafeRecordProps
}

export const fetchSafe = (safeAddress: string) => async (dispatch: Dispatch): Promise<void> => {
  const checksummedSafeAddress = checksumAddress(safeAddress)
  const safeInfo: Partial<SafeRecordProps> = {
    address: checksummedSafeAddress,
    name: 'UNNAMED',
  }

  const [remoteSafeInfoSettled, localSafeInfoSettled] = await Promise.allSettled([
    getSafeInfo(checksummedSafeAddress),
    getLocalSafe(checksummedSafeAddress),
  ])

  // remote (client-gateway)
  const remoteSafeInfo = await extractRemoteSafeInfo(remoteSafeInfoSettled, checksummedSafeAddress)

  // local (localStorage)
  const localSafeInfo = await extractLocalSafeInfo(localSafeInfoSettled, remoteSafeInfoSettled.status === 'fulfilled')

  dispatch(updateSafe({ ...safeInfo, ...remoteSafeInfo, ...localSafeInfo }))

  updateSafeOwners(remoteSafeInfoSettled, localSafeInfoSettled, checksummedSafeAddress, dispatch)
}
