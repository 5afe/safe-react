import semverLessThan from 'semver/functions/lt'
import semverSatisfies from 'semver/functions/satisfies'
import semverValid from 'semver/functions/valid'

import { getSafeLastVersion } from 'src/config'
import { getGnosisSafeInstanceAt, getSafeMasterContract } from 'src/logic/contracts/safeContracts'

export const FEATURES = [
  { name: 'ERC721', validVersion: '>=1.1.1' },
  { name: 'ERC1155', validVersion: '>=1.1.1' },
]

export const safeNeedsUpdate = (currentVersion, latestVersion) => {
  if (!currentVersion || !latestVersion) {
    return false
  }

  const current = semverValid(currentVersion)
  const latest = semverValid(latestVersion)

  return latest ? semverLessThan(current, latest) : false
}

export const getCurrentSafeVersion = (gnosisSafeInstance) => gnosisSafeInstance.VERSION()

export const enabledFeatures = (version) =>
  FEATURES.reduce((acc, feature) => {
    if (semverSatisfies(version, feature.validVersion)) {
      acc.push(feature.name)
    }
    return acc
  }, [])

export const checkIfSafeNeedsUpdate = async (gnosisSafeInstance, lastSafeVersion) => {
  if (!gnosisSafeInstance || !lastSafeVersion) {
    return null
  }
  const safeMasterVersion = await getCurrentSafeVersion(gnosisSafeInstance)
  const current = semverValid(safeMasterVersion)
  const latest = semverValid(lastSafeVersion)
  const needUpdate = safeNeedsUpdate(safeMasterVersion, lastSafeVersion)

  return { current, latest, needUpdate }
}

export const getCurrentMasterContractLastVersion = async () => {
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

export const getSafeVersionInfo = async (safeAddress) => {
  try {
    const safeMaster = await getGnosisSafeInstanceAt(safeAddress)
    const lastSafeVersion = await getCurrentMasterContractLastVersion()
    return checkIfSafeNeedsUpdate(safeMaster, lastSafeVersion)
  } catch (err) {
    console.error(err)
    throw err
  }
}
