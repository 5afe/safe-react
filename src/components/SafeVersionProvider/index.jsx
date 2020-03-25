// @flow
import * as React from 'react'
import { useSelector } from 'react-redux'
import semverLessThan from 'semver/functions/lt'
import satisfies from 'semver/functions/satisfies'
import semverValid from 'semver/functions/valid'

import Modal from '~/components/Modal'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { getCurrentMasterContractLastVersion } from '~/logic/safe/utils/safeVersion'
import UpdateSafeModal from '~/routes/safe/components/Settings/UpdateSafeModal'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

type TSafeVersion = {
  currentVersion: string,
  featuresEnabled: string[],
  lastVersion: string,
  needsUpdate: boolean,
  upgradeSafe: () => void,
}

export const SafeVersionContext = React.createContext<TSafeVersion>({
  currentVersion: '',
  featuresEnabled: [],
  lastVersion: '',
  needsUpdate: false,
  upgradeSafe: () => {},
})

const SafeVersionProvider = ({ children }: { children: React.Node }) => {
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { currentVersion, lastVersion } = useSafeVersions(safeAddress)
  const needsUpdate = useUpdateChecker(currentVersion, lastVersion)
  const featuresEnabled = useFeaturesEnabled(currentVersion)
  const [willUpgrade, setWillUpgrade] = React.useState(false)

  const upgradeSafe = () => {
    setWillUpgrade(true)
  }

  const closeUpgrade = () => {
    setWillUpgrade(false)
  }

  return (
    <SafeVersionContext.Provider value={{ currentVersion, featuresEnabled, lastVersion, needsUpdate, upgradeSafe }}>
      <>
        {children}
        <Modal description="Update Safe" handleClose={closeUpgrade} open={willUpgrade} title="Update Safe">
          <UpdateSafeModal onClose={closeUpgrade} safeAddress={safeAddress} />
        </Modal>
      </>
    </SafeVersionContext.Provider>
  )
}

function useSafeVersions(safeAddress: string) {
  const [versions, setVersions] = React.useState({ currentVersion: '', lastVersion: '' })

  React.useEffect(() => {
    let isCurrent = true

    async function getVersions() {
      const [currentSafeInstance, lastSafeVersion] = await Promise.all([
        getGnosisSafeInstanceAt(safeAddress),
        getCurrentMasterContractLastVersion(),
      ])
      const version = await currentSafeInstance.VERSION()

      setVersions({ currentVersion: version, lastVersion: lastSafeVersion })
    }

    if (isCurrent) {
      getVersions().catch(console.error)
    }

    return () => {
      isCurrent = false
    }
  }, [safeAddress])

  return versions
}

function useUpdateChecker(currentVersion, lastSafeVersion) {
  const [needsUpdate, setNeedsUpdate] = React.useState(false)

  React.useEffect(() => {
    let isCurrent = true

    async function checkIfNeedsUpdate() {
      const current = semverValid(currentVersion)
      const latest = semverValid(lastSafeVersion)
      const needsUpdate = latest ? semverLessThan(current, latest) : false

      setNeedsUpdate(needsUpdate)
    }

    if (isCurrent) {
      checkIfNeedsUpdate()
    }

    return () => {
      isCurrent = false
    }
  }, [currentVersion])

  return needsUpdate
}

function useFeaturesEnabled(currentVersion) {
  const [featuresEnabled, setFeaturesEnabled] = React.useState([])

  React.useEffect(() => {
    const features = [
      { name: 'ERC721', validVersion: '>=1.1.1' },
      { name: 'ERC1155', validVersion: '>=1.1.1' },
    ]

    const enabledFeatures = features.reduce((acc, feature) => {
      if (satisfies(currentVersion, feature.validVersion)) {
        acc.push(feature.name)
      }
      return acc
    }, [])

    setFeaturesEnabled(enabledFeatures)
  }, [currentVersion])

  return featuresEnabled
}

export default SafeVersionProvider
