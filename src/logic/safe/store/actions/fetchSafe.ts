import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getLocalSafe } from 'src/logic/safe/utils'
import { getSafeInfo } from 'src/logic/safe/utils/safeInformation'
import { SafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { checksumAddress } from 'src/utils/checksumAddress'
import { buildSafeOwners, extractRemoteSafeInfo } from './utils'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { store } from 'src/store'
import { currentSafeWithNames } from '../selectors'
import fetchTransactions from './transactions/fetchTransactions'
import { fetchCollectibles } from 'src/logic/collectibles/store/actions/fetchCollectibles'
import { currentChainId } from 'src/logic/config/store/selectors'
import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'

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

  const local = getLocalSafe(safeAddress)
  const remote = await getSafeInfo(safeAddress).catch((err) => {
    err.log()
    return null
  })

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
export const fetchSafe =
  (safeAddress: string, isInitialLoad = false) =>
  async (dispatch: Dispatch<any>): Promise<Action<Partial<SafeRecordProps>> | void> => {
    let address = ''
    try {
      address = checksumAddress(safeAddress)
    } catch (err) {
      logError(Errors._102, safeAddress)
      return
    }

    let safeInfo: Partial<SafeRecordProps> = {}
    let remoteSafeInfo: SafeInfo | null = null

    try {
      remoteSafeInfo = await getSafeInfo(address)
    } catch (err) {
      err.log()
    }

    const state = store.getState()
    const chainId = currentChainId(state)

    // remote (client-gateway)
    if (remoteSafeInfo) {
      // If the network has changed while the safe was being loaded,
      // ignore the result
      if (remoteSafeInfo.chainId !== chainId) {
        return
      }

      safeInfo = await extractRemoteSafeInfo(remoteSafeInfo)

      // If these polling timestamps have changed, fetch again
      const { collectiblesTag, txQueuedTag, txHistoryTag } = currentSafeWithNames(state)

      const shouldUpdateCollectibles = collectiblesTag !== safeInfo.collectiblesTag
      const shouldUpdateTxHistory = txHistoryTag !== safeInfo.txHistoryTag
      const shouldUpdateTxQueued = txQueuedTag !== safeInfo.txQueuedTag

      dispatch(fetchSafeTokens(address))

      if (shouldUpdateCollectibles || isInitialLoad) {
        dispatch(fetchCollectibles(address))
      }

      if (shouldUpdateTxHistory || shouldUpdateTxQueued || isInitialLoad) {
        dispatch(fetchTransactions(chainId, address))
      }

      if (isInitialLoad) {
        dispatch(addViewedSafe(address))
      }
    }

    const owners = buildSafeOwners(remoteSafeInfo?.owners || [])

    return dispatch(updateSafe({ address, ...safeInfo, owners }))
  }
