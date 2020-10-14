import semverLessThan from 'semver/functions/lt'
import semverSatisfies from 'semver/functions/satisfies'
import semverValid from 'semver/functions/valid'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'

import { getGnosisSafeInstanceAt, getSafeMasterContract } from 'src/logic/contracts/safeContracts'
import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import { getNetworkConfigDisabledFeatures } from 'src/config'
import { FEATURES } from 'src/config/networks/network.d'

type FeatureConfigByVersion = {
  name: FEATURES
  validVersion?: string
}

const FEATURES_BY_VERSION: FeatureConfigByVersion[] = [
  { name: FEATURES.ERC721, validVersion: '>=1.1.1' },
  { name: FEATURES.ERC1155, validVersion: '>=1.1.1' },
  { name: FEATURES.SAFE_APPS },
  { name: FEATURES.CONTRACT_INTERACTION },
]

type Feature = typeof FEATURES_BY_VERSION[number]

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

const checkFeatureEnabledByVersion = (featureConfig: FeatureConfigByVersion, version: string) => {
  return featureConfig.validVersion ? semverSatisfies(version, featureConfig.validVersion) : true
}

export const enabledFeatures = (version?: string): FEATURES[] => {
  const disabledFeatures = getNetworkConfigDisabledFeatures()
  return FEATURES_BY_VERSION.reduce((acc: FEATURES[], feature: Feature) => {
    if (!disabledFeatures.includes(feature.name) && version && checkFeatureEnabledByVersion(feature, version)) {
      acc.push(feature.name)
    }
    return acc
  }, [])
}

interface SafeVersionInfo {
  current: string
  latest: string
  needUpdate: boolean
}

export const checkIfSafeNeedsUpdate = async (
  gnosisSafeInstance: GnosisSafe,
  lastSafeVersion: string,
): Promise<SafeVersionInfo> => {
  if (!gnosisSafeInstance || !lastSafeVersion) {
    throw new Error('checkIfSafeNeedsUpdate: No Safe Instance or version provided')
  }
  const safeMasterVersion = await getCurrentSafeVersion(gnosisSafeInstance)
  const current = semverValid(safeMasterVersion) as string
  const latest = semverValid(lastSafeVersion) as string
  const needUpdate = safeNeedsUpdate(safeMasterVersion, lastSafeVersion)

  return { current, latest, needUpdate }
}

export const getCurrentMasterContractLastVersion = async (): Promise<string> => {
  const safeMaster = await getSafeMasterContract()
  let safeMasterVersion
  try {
    safeMasterVersion = await safeMaster.methods.VERSION().call()
  } catch (err) {
    // Default in case that it's not possible to obtain the version from the contract, returns a hardcoded value or an
    // env variable
    safeMasterVersion = LATEST_SAFE_VERSION
  }
  return safeMasterVersion
}

export const getSafeVersionInfo = async (safeAddress: string): Promise<SafeVersionInfo> => {
  try {
    const safeMaster = getGnosisSafeInstanceAt(safeAddress)
    const lastSafeVersion = await getCurrentMasterContractLastVersion()
    return checkIfSafeNeedsUpdate(safeMaster, lastSafeVersion)
  } catch (err) {
    console.error(err)
    throw err
  }
}
