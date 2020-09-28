import semverLessThan from 'semver/functions/lt'
import semverSatisfies from 'semver/functions/satisfies'
import semverValid from 'semver/functions/valid'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'

import { getSafeLastVersion } from 'src/config'
import { getGnosisSafeInstanceAt, getSafeMasterContract } from 'src/logic/contracts/safeContracts'

export const FEATURES = [
  { name: 'ERC721', validVersion: '>=1.1.1' },
  { name: 'ERC1155', validVersion: '>=1.1.1' },
]

type Feature = typeof FEATURES[number]

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

export const enabledFeatures = (version: string): string[] =>
  FEATURES.reduce((acc: string[], feature: Feature) => {
    if (semverSatisfies(version, feature.validVersion)) {
      acc.push(feature.name)
    }
    return acc
  }, [])

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
    safeMasterVersion = await safeMaster.VERSION()
  } catch (err) {
    // Default in case that it's not possible to obtain the version from the contract, returns a hardcoded value or an
    // env variable
    safeMasterVersion = getSafeLastVersion()
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
