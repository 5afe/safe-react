// @flow
import semverValid from 'semver/functions/valid'
import semverLessThan from 'semver/functions/lt'
import { getSafeMasterContract } from '~/logic/contracts/safeContracts'
import { getSafeLastVersion } from '~/config'

export const getSafeVersion = async () => {
  let current
  let latest
  try {
    const safeMaster = await getSafeMasterContract()
    const safeMasterVersion = await safeMaster.VERSION()
    current = semverValid(safeMasterVersion)
    latest = semverValid(getSafeLastVersion())
    const needUpdate = latest ? semverLessThan(current, latest) : false

    return { current, latest, needUpdate }
  } catch (err) {
    console.error(err)
    throw err
  }
}
