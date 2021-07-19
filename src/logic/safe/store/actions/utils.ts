import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { TxServiceModel } from './transactions/fetchTransactions/loadOutgoingTransactions'
import axios from 'axios'

import { LATEST_SAFE_VERSION, SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { buildTxServiceUrl } from 'src/logic/safe/transactions/txHistory'
import { SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getSpendingLimits } from 'src/logic/safe/utils/spendingLimits'
import { buildModulesLinkedList } from 'src/logic/safe/utils/modules'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { checksumAddress } from 'src/utils/checksumAddress'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

export const getLastTx = async (safeAddress: string): Promise<TxServiceModel | null> => {
  try {
    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, { params: { limit: 1 } })

    return response.data.results[0] || null
  } catch (e) {
    console.error('failed to retrieve last Tx from server', e)
    return null
  }
}

export const getNewTxNonce = async (lastTx: TxServiceModel | null, safeInstance: GnosisSafe): Promise<string> => {
  // use current's safe nonce as fallback
  return lastTx ? `${lastTx.nonce + 1}` : (await safeInstance.methods.nonce().call()).toString()
}

export const shouldExecuteTransaction = async (
  safeInstance: GnosisSafe,
  nonce: string,
  lastTx: TxServiceModel | null,
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

  // If the previous tx is not executed or the different between lastTx.nonce and nonce is > 1
  // it's delayed using the approval mechanisms.
  // Once the previous tx is executed, the current tx will be available to be executed
  // by the user using the exec button.
  if (lastTx) {
    return lastTx.isExecuted && lastTx.nonce + 1 === Number(nonce)
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
    spendingLimitEnabled: false,
  }
  const safeInfoModules = (remoteSafeInfo.modules || []).map(({ value }) => value)

  if (safeInfoModules.length) {
    safeInfo.modules = buildModulesLinkedList(safeInfoModules)
    safeInfo.spendingLimitEnabled =
      safeInfoModules?.some((module) => sameAddress(module, SPENDING_LIMIT_MODULE_ADDRESS)) ?? false
    try {
      safeInfo.spendingLimits = await getSpendingLimits(
        safeInfoModules,
        remoteSafeInfo.address.value,
        safeInfo.spendingLimitEnabled,
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
