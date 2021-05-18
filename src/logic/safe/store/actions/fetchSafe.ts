import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getLocalSafe } from 'src/logic/safe/utils'
import { allSettled } from 'src/logic/safe/utils/allSettled'
import { getSafeInfo, SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafeOwners, extractRemoteSafeInfo } from './utils'

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
  const address = checksumAddress(safeAddress)
  const safeInfo: Partial<SafeRecordProps> = {
    address,
    name: safeName,
  }

  const [remote, localSafeInfo] = await allSettled<[SafeInfo | null, SafeRecordProps | undefined | null]>(
    getSafeInfo(safeAddress),
    getLocalSafe(safeAddress),
  )

  // remote (client-gateway)
  const remoteSafeInfo = remote ? await extractRemoteSafeInfo(remote) : {}

  // update owner's information
  const owners = buildSafeOwners(remote?.owners, localSafeInfo?.owners)

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
): Promise<Action<Partial<SafeRecordProps>>> => {
  const address = checksumAddress(safeAddress)

  const [remoteSafeInfo] = await allSettled<[SafeInfo | null]>(getSafeInfo(address))

  // remote (client-gateway)
  const safeInfo = remoteSafeInfo ? await extractRemoteSafeInfo(remoteSafeInfo) : {}

  // update owner's information
  const owners = remoteSafeInfo
    ? // if we have remote info, we use it
      buildSafeOwners(remoteSafeInfo.owners)
    : // if there's no remote info, we keep what's in memory
      undefined

  return dispatch(updateSafe({ address, ...safeInfo, owners }))
}
