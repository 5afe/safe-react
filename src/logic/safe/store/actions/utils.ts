import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { TxServiceModel } from './transactions/fetchTransactions/loadOutgoingTransactions'
import axios from 'axios'

import { buildTxServiceUrl } from 'src/logic/safe/transactions/txHistory'
import { SafeInfo } from 'src/logic/safe/utils/safeInformation'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { getSpendingLimits } from 'src/logic/safe/utils/spendingLimits'
import { buildModulesLinkedList } from 'src/logic/safe/utils/modules'
import { enabledFeatures, safeNeedsUpdate } from 'src/logic/safe/utils/safeVersion'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { makeOwner } from 'src/logic/safe/store/models/owner'
import { checksumAddress } from 'src/utils/checksumAddress'
import { List } from 'immutable'

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
  }
  const safeInfoModules = remoteSafeInfo.modules.map(({ value }) => value)

  if (safeInfoModules.length) {
    safeInfo.modules = buildModulesLinkedList(safeInfoModules)
    safeInfo.spendingLimits = await getSpendingLimits(safeInfoModules, remoteSafeInfo.address.value)
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
 * @param {SafeInfo['owners'] | undefined} remoteSafeOwners
 * @param {SafeRecordProps['owners'] | undefined} localSafeOwners
 * @returns SafeRecordProps['owners'] | undefined
 */
export const buildSafeOwners = (
  remoteSafeOwners?: SafeInfo['owners'],
  localSafeOwners?: SafeRecordProps['owners'],
): SafeRecordProps['owners'] | undefined => {
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
