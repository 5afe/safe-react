import semverLessThan from 'semver/functions/lt'
import semverSatisfies from 'semver/functions/satisfies'
import semverValid from 'semver/functions/valid'
import { FEATURES, getMasterCopies } from '@gnosis.pm/safe-react-gateway-sdk'

import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { getSafeMasterContract } from 'src/logic/contracts/safeContracts'
import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { getChainInfo } from 'src/config'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

const FEATURES_BY_VERSION: Record<string, string> = {
  [FEATURES.SAFE_TX_GAS_OPTIONAL]: '>=1.3.0',
}

export const safeNeedsUpdate = (currentVersion?: string, latestVersion?: string): boolean => {
  if (!currentVersion || !latestVersion) {
    return false
  }

  const current = semverValid(currentVersion) as string
  const latest = semverValid(latestVersion) as string

  return latest ? semverLessThan(current, latest) : false
}

export const getCurrentSafeVersion = (gnosisSafeInstance: GnosisSafe): Promise<string> =>
  gnosisSafeInstance.methods.VERSION().call()

const isEnabledByVersion = (feature: FEATURES, version: string): boolean => {
  if (!(feature in FEATURES_BY_VERSION)) return true
  return semverSatisfies(version, FEATURES_BY_VERSION[feature])
}

/**
 * Get a combined list of features enabled per chain and per version
 */
export const enabledFeatures = (version?: string): FEATURES[] => {
  const chainFeatures = getChainInfo().features
  if (!version) return chainFeatures
  return chainFeatures.filter((feat) => isEnabledByVersion(feat, version))
}

export const hasFeature = (name: FEATURES, version?: string): boolean => {
  return enabledFeatures(version).includes(name)
}

interface SafeVersionInfo {
  current: string
  latest: string
  needUpdate: boolean
}

export const checkIfSafeNeedsUpdate = async (
  safeVersion: string,
  lastSafeVersion: string,
): Promise<SafeVersionInfo> => {
  if (!safeVersion || !lastSafeVersion) {
    throw new Error('checkIfSafeNeedsUpdate: No Safe Instance or version provided')
  }
  const current = semverValid(safeVersion) as string
  const latest = semverValid(lastSafeVersion) as string
  const needUpdate = safeNeedsUpdate(safeVersion, lastSafeVersion)

  return { current, latest, needUpdate }
}

export const getCurrentMasterContractLastVersion = async (): Promise<string> => {
  let safeMasterVersion: string
  try {
    const safeMaster = getSafeMasterContract()
    safeMasterVersion = await safeMaster.methods.VERSION().call()
  } catch (err) {
    // Default in case that it's not possible to obtain the version from the contract, returns a hardcoded value or an
    // env variable
    safeMasterVersion = LATEST_SAFE_VERSION
  }
  return safeMasterVersion
}

export const getSafeVersionInfo = async (safeVersion: string): Promise<SafeVersionInfo | undefined> => {
  try {
    const lastSafeVersion = await getCurrentMasterContractLastVersion()
    return checkIfSafeNeedsUpdate(safeVersion, lastSafeVersion)
  } catch (err) {
    logError(Errors._606, err.message)
  }
}

export const isValidMasterCopy = async (chainId: string, masterCopyAddress: string): Promise<boolean> => {
  const supportedMasterCopies = await getMasterCopies(chainId)

  return supportedMasterCopies.some((supportedMasterCopy) =>
    sameAddress(supportedMasterCopy.address, masterCopyAddress),
  )
}
