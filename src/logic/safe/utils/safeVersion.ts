import semverLessThan from 'semver/functions/lt'
import semverSatisfies from 'semver/functions/satisfies'
import semverValid from 'semver/functions/valid'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { getSafeMasterContract } from 'src/logic/contracts/safeContracts'
import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { getChainInfo } from 'src/config'

type FeatureConfigByVersion = {
  name: FEATURES
  validVersion?: string
}

const FEATURES_BY_VERSION: FeatureConfigByVersion[] = [
  { name: FEATURES.ERC1155, validVersion: '>=1.1.1' },
  { name: FEATURES.SAFE_TX_GAS_OPTIONAL, validVersion: '>=1.3.0' },
]

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

const checkFeatureEnabledByVersion = (featureConfig: FeatureConfigByVersion, version?: string) => {
  if (!version) return false
  return featureConfig.validVersion ? semverSatisfies(version, featureConfig.validVersion) : true
}

/**
 * Get a combined list of features enabled per chain and per version
 */
export const enabledFeatures = (version?: string): FEATURES[] => {
  const chainFeatures = getChainInfo().features

  const versionedFeatures = FEATURES_BY_VERSION.filter((feat) => checkFeatureEnabledByVersion(feat, version)).map(
    ({ name }) => name,
  )

  return chainFeatures.concat(versionedFeatures)
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
    const safeMaster = await getSafeMasterContract()
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
