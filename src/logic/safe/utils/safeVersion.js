// @flow
import semverValid from 'semver/functions/valid'
import semverLessThan from 'semver/functions/lt'
import { getGnosisSafeInstanceAt, getSafeMasterContract } from '~/logic/contracts/safeContracts'
import { getSafeLastVersion } from '~/config'

export const checkIfSafeNeedsUpdate = async (gnosisSafeInstance, lastSafeVersion) => {
  if (!gnosisSafeInstance || !lastSafeVersion) {
    return null
  }
  const safeMasterVersion = await gnosisSafeInstance.VERSION()
  const current = semverValid(safeMasterVersion)
  const latest = semverValid(lastSafeVersion)
  const needUpdate = latest ? semverLessThan(current, latest) : false
  return { current, latest, needUpdate }
}

const getCurrentMasterContractLastVersion = async () => {
  const safeMaster = await getSafeMasterContract()
  let safeMasterVersion
  try {
    safeMasterVersion = await safeMaster.VERSION()
  } catch (err) {
    // Default in case that it's not possible to obtain the version from the contract, returns a hardcoded value or an env variable
    safeMasterVersion = getSafeLastVersion()
  }
  return safeMasterVersion
}

export const getSafeVersion = async (safeAddress: string) => {
  try {
    const safeMaster = await getGnosisSafeInstanceAt(safeAddress)
    return checkIfSafeNeedsUpdate(safeMaster, getCurrentMasterContractLastVersion())
  } catch (err) {
    console.error(err)
    throw err
  }
}
