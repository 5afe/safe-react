import { generatePath } from 'react-router-dom'
import { SafeInfo, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getSpendingLimits } from 'src/logic/safe/utils/spendingLimits'
import { buildModulesLinkedList } from 'src/logic/safe/utils/modules'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { checksumAddress } from 'src/utils/checksumAddress'
import { ChainId } from 'src/config/chain.d'

import {
  Transaction,
  isMultisigExecutionInfo,
  LocalTransactionStatus,
  isMultiSigExecutionDetails,
} from 'src/logic/safe/store/models/types/gateway.d'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { getRecommendedNonce } from '../../api/fetchSafeTxGasEstimation'
import {
  extractPrefixedSafeAddress,
  getPrefixedSafeAddressSlug,
  history,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
  TRANSACTION_ID_SLUG,
} from 'src/routes/routes'

export const canExecuteCreatedTx = async (
  safeInstance: GnosisSafe,
  nonce: string,
  lastTx: Transaction | null,
): Promise<boolean> => {
  const safeNonce = (await safeInstance.methods.nonce().call()).toString()
  const thresholdAsString = await safeInstance.methods.getThreshold().call()
  const threshold = Number(thresholdAsString)

  // Needs to collect owners signatures
  if (threshold > 1) {
    return false
  }

  // Allow first tx.
  if (Number(nonce) === 0) {
    return true
  }

  // Allow if nonce === safeNonce and threshold === 1
  if (nonce === safeNonce) {
    return true
  }

  // If the previous tx is not executed or the difference between lastTx.nonce and nonce is > 1
  // it's delayed using the approval mechanism.
  // Once the previous tx is executed, the current tx will be available to be executed
  // by the user using the exec button.
  if (lastTx && isMultisigExecutionInfo(lastTx.executionInfo)) {
    return lastTx.txStatus === LocalTransactionStatus.SUCCESS && lastTx.executionInfo.nonce + 1 === Number(nonce)
  }

  return false
}

/**
 * Recovers Safe's remote information along with its modules and spendingLimits if there's any
 * @param {SafeInfo} remoteSafeInfo
 * @returns Promise<Partial<SafeRecordProps>>
 */
export const extractRemoteSafeInfo = async (remoteSafeInfo: SafeInfo): Promise<Partial<SafeRecordProps>> => {
  const safeInfo: Partial<SafeRecordProps> = {
    modules: undefined,
    spendingLimits: undefined,
  }
  const safeInfoModules = (remoteSafeInfo.modules || []).map(({ value }) => value)

  if (safeInfoModules.length) {
    safeInfo.modules = buildModulesLinkedList(safeInfoModules)
    try {
      safeInfo.spendingLimits = await getSpendingLimits(
        safeInfoModules,
        remoteSafeInfo.address.value,
        remoteSafeInfo.chainId,
      )
    } catch (e) {
      e.log()
      safeInfo.spendingLimits = null
    }
  }

  safeInfo.nonce = remoteSafeInfo.nonce
  safeInfo.threshold = remoteSafeInfo.threshold
  safeInfo.currentVersion = remoteSafeInfo.version
  safeInfo.needsUpdate = safeNeedsUpdate(safeInfo.currentVersion, LATEST_SAFE_VERSION)
  safeInfo.featuresEnabled = enabledFeatures(safeInfo.currentVersion)
  safeInfo.guard = remoteSafeInfo.guard ? remoteSafeInfo.guard.value : undefined
  safeInfo.collectiblesTag = remoteSafeInfo.collectiblesTag
  safeInfo.txQueuedTag = remoteSafeInfo.txQueuedTag
  safeInfo.txHistoryTag = remoteSafeInfo.txHistoryTag
  safeInfo.chainId = remoteSafeInfo.chainId as ChainId
  safeInfo.implementation = remoteSafeInfo.implementation

  return safeInfo
}

/**
 * Merges remote owner's information with the locally stored data.
 * If there's no remote data, it will go with the locally stored information.
 * @param {SafeInfo['owners'] | undefined} remoteSafeOwners
 * @param {SafeRecordProps['owners'] | undefined} localSafeOwners
 * @returns SafeRecordProps['owners'] | undefined
 */
export const buildSafeOwners = (
  remoteSafeOwners?: SafeInfo['owners'],
  localSafeOwners?: SafeRecordProps['owners'],
): SafeRecordProps['owners'] | undefined => {
  if (remoteSafeOwners) {
    // ToDo: review if checksums addresses is necessary,
    //  as they must be provided already in the checksum form from the services
    return remoteSafeOwners.map(({ value }) => checksumAddress(value))
  }

  // nothing to do without remote owners, so we return the stored list
  return localSafeOwners
}

export const getNonce = async (safeAddress: string, safeVersion: string): Promise<string> => {
  let nextNonce: string
  try {
    nextNonce = (await getRecommendedNonce(safeAddress)).toString()
  } catch (e) {
    logError(Errors._616, e.message)
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
    nextNonce = await safeInstance.methods.nonce().call()
  }
  return nextNonce
}

export const navigateToTx = (safeAddress: string, txDetails: TransactionDetails): void => {
  if (!isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
    return
  }
  const { shortName } = extractPrefixedSafeAddress()
  const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName, safeAddress })
  const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
    [TRANSACTION_ID_SLUG]: txDetails.txId,
  })

  history.push(txRoute)
}
