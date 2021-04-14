import { List } from 'immutable'
import { Dispatch } from 'redux'

import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import { ModulePair, SafeOwner, SafeRecordProps, SpendingLimit } from 'src/logic/safe/store/models/safe'
import { getLocalSafe } from 'src/logic/safe/utils'
import { getModules } from 'src/logic/safe/utils/modules'
import { allSettled } from 'src/logic/safe/utils/allSettled'
import { getSafeInfo, SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { getSpendingLimits } from 'src/logic/safe/utils/spendingLimits'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'

/**
 * Recovers Safe's remote information along with its modules and spendingLimits if there's any
 * @param {SafeInfo} remoteSafeInfo
 * @param {string} checksummedSafeAddress
 * @returns Promise<Partial<SafeRecordProps>>
 */
const extractRemoteSafeInfo = async (
  remoteSafeInfo: SafeInfo,
  checksummedSafeAddress: string,
): Promise<Partial<SafeRecordProps>> => {
  const safeInfo: Partial<SafeRecordProps> = {
    spendingLimits: undefined,
    modules: undefined,
  }
  const safeInfoModules = remoteSafeInfo.modules.map(({ value }) => value)

  if (safeInfoModules.length) {
    const [spendingLimits, modules] = await allSettled<[SpendingLimit[] | null, ModulePair[] | null | undefined]>(
      getSpendingLimits(safeInfoModules, checksummedSafeAddress),
      getModules(remoteSafeInfo),
    )

    safeInfo.spendingLimits = spendingLimits
    safeInfo.modules = modules
  }

  safeInfo.nonce = remoteSafeInfo.nonce
  safeInfo.threshold = remoteSafeInfo.threshold
  safeInfo.currentVersion = remoteSafeInfo.version
  // FixMe: replace '1.1.1' hardcoded value in favor of data provided by services
  //  see: https://github.com/gnosis/safe-react/issues/1383#issuecomment-815425652
  safeInfo.needsUpdate = safeNeedsUpdate(safeInfo.currentVersion, '1.1.1')
  safeInfo.featuresEnabled = enabledFeatures(safeInfo.currentVersion)

  return safeInfo
}

/**
 * Merges remote owner's information with the locally stored data.
 * If there's no remote data, it will go with the locally stored information.
 * @param {SafeInfo['owners']} remoteSafeOwners
 * @param {SafeRecordProps['owners']} localSafeOwners
 * @returns List<SafeOwners> | undefined
 */
const extractSafeOwners = (
  remoteSafeOwners?: SafeInfo['owners'],
  localSafeOwners?: SafeRecordProps['owners'],
): List<SafeOwner> | undefined => {
  if (remoteSafeOwners) {
    const remoteOwners = remoteSafeOwners.map(({ value }) => {
      const localOwner = localSafeOwners?.find(({ address }) => sameAddress(address, value))
      const name = localOwner?.name
      return makeOwner({ name, address: checksumAddress(value) })
    })

    return List(remoteOwners)
  }

  // nothing to do without remote owners, so we return the stored list
  return localSafeOwners
}

/**
 * Builds a Safe Record that will be added to the app's store
 * It recovers, and merges information from client-gateway and localStore
 *
 * @note It's being used by "Load Existing Safe" and "Create New Safe" flows
 *
 * @param {string} safeAddress
 * @param {string} safeName
 * @returns Promise<SafeRecordProps>
 */
export const buildSafe = async (safeAddress: string, safeName: string): Promise<SafeRecordProps> => {
  const checksummedSafeAddress = checksumAddress(safeAddress)
  const safeInfo: Partial<SafeRecordProps> = {
    address: checksummedSafeAddress,
    name: safeName,
  }

  const [remote, localSafeInfo] = await allSettled<[SafeInfo | null, SafeRecordProps | undefined | null]>(
    getSafeInfo(safeAddress),
    getLocalSafe(safeAddress),
  )

  // remote (client-gateway)
  const remoteSafeInfo = remote ? await extractRemoteSafeInfo(remote, checksummedSafeAddress) : {}

  // update owner's information
  const owners = extractSafeOwners(remote?.owners, localSafeInfo?.owners)

  return { ...safeInfo, ...localSafeInfo, ...remoteSafeInfo, owners } as SafeRecordProps
}

/**
 * Updates the app's store with Safe Record built from data provided by client-gateway
 *
 * @note It's being used by the app when it loads for the first time and for the Safe's data polling
 *
 * @param {string} safeAddress
 */
export const fetchSafe = (safeAddress: string) => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<void> => {
  const address = checksumAddress(safeAddress)

  const [remoteSafeInfo] = await allSettled<[SafeInfo | null]>(getSafeInfo(address))

  // remote (client-gateway)
  const safeInfo = remoteSafeInfo ? await extractRemoteSafeInfo(remoteSafeInfo, address) : {}

  // TODO: REVIEW: having the owner's names duplicated with what's in the address book seems a bit odd
  const state = getState()
  const addressBook = addressBookSelector(state)
  // update owner's information
  const owners = remoteSafeInfo
    ? // if we have remote info, we can enrich it with local address book information
      extractSafeOwners(remoteSafeInfo.owners, List(addressBook))
    : // if there's no remote info, we keep what's in memory
      undefined

  dispatch(updateSafe({ address, ...safeInfo, owners }))
}
