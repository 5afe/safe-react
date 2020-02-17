// @flow
import semverValid from 'semver/functions/valid'
import semverLessThan from 'semver/functions/lt'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
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

export const getSafeVersion = async (safeAddress: string) => {
  try {
    const safeMaster = await getGnosisSafeInstanceAt(safeAddress)
    return checkIfSafeNeedsUpdate(safeMaster, getSafeLastVersion())
  } catch (err) {
    console.error(err)
    throw err
  }
}
