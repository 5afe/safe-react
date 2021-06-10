import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getLocalSafe } from 'src/logic/safe/utils'
import { getSafeInfo, SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafeOwners, extractRemoteSafeInfo } from './utils'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

/**
 * Builds a Safe Record that will be added to the app's store
 * It recovers, and merges information from client-gateway and localStore
 *
 * @note It's being used by "Load Existing Safe" and "Create New Safe" flows
 *
 * @param {string} safeAddress
 * @returns Promise<SafeRecordProps>
 */
export const buildSafe = async (safeAddress: string): Promise<SafeRecordProps> => {
  const address = checksumAddress(safeAddress)
  // setting `loadedViaUrl` to false, as `buildSafe` is called on safe Load or Open flows
  const safeInfo: Partial<SafeRecordProps> = { address, loadedViaUrl: false }

  const [remote, local] = await Promise.all([
    getSafeInfo(safeAddress).catch((err) => {
      err.log()
      return null
    }),
    getLocalSafe(safeAddress),
  ])

  // remote (client-gateway)
  const remoteSafeInfo = remote ? await extractRemoteSafeInfo(remote) : {}
  // local
  const localSafeInfo = local || ({} as Partial<SafeRecordProps>)

  // update owner's information
  const owners = buildSafeOwners(remote?.owners, localSafeInfo.owners)

  return { ...localSafeInfo, ...safeInfo, ...remoteSafeInfo, owners } as SafeRecordProps
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
): Promise<Action<Partial<SafeRecordProps>> | void> => {
  let address = ''
  try {
    address = checksumAddress(safeAddress)
  } catch (err) {
    logError(Errors._102, safeAddress)
    return
  }

  let safeInfo = {}
  let remoteSafeInfo: SafeInfo | null = null

  // if there's no remote info, we keep what's in memory
  try {
    remoteSafeInfo = await getSafeInfo(address)
  } catch (err) {
    err.log()
  }

  // remote (client-gateway)
  if (remoteSafeInfo) {
    safeInfo = await extractRemoteSafeInfo(remoteSafeInfo)
  }

  const owners = buildSafeOwners(remoteSafeInfo?.owners)

  return dispatch(updateSafe({ address, ...safeInfo, owners }))
}
