import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { MigrationMessage } from 'src/routes/migration/container'
import { MIGRATION_ADDRESS } from 'src/routes/routes'
import { saveMigratedKeyToStorage } from 'src/utils/storage'

// FIXME set staging and production version URLs
export const MAINET_URL = 'https://pr2695--safereact.review.gnosisdev.com/mainnet/app'
const networks = [
  'https://pr2774--safereact.review.gnosisdev.com/rinkeby/app',
  'https://pr2729--safereact.review.gnosisdev.com/polygon/app',
]

// FIXME Aaron, this are the old URLs, I already added them here for convenience. Tweak as necessary
// const STAGING_MAINNET_URL = 'https://safe-team-mainnet.staging.gnosisdev.com/app'
// const stagingSubDomainUrls = [
//   'https://safe-team-bsc.staging.gnosisdev.com/app',
//   'https://safe-team-ewc.staging.gnosisdev.com/app',
//   'https://safe-team-polygon.staging.gnosisdev.com/app',
//   'https://safe-team-rinkeby.staging.gnosisdev.com/app',
//   'https://safe-team-volta.staging.gnosisdev.com/app',
//   'https://safe-team-xdai.staging.gnosisdev.com/app',
// ]

// const PROD_MAINNET_URL = 'https://gnosis-safe.io/app'
// const prodSubDomainUrls = [
//   'https://bsc.gnosis-safe.io/app',
//   'https://ewc.gnosis-safe.io/app',
//   'https://polygon.gnosis-safe.io/app',
//   'https://rinkeby.gnosis-safe.io/app',
//   'https://volta.gnosis-safe.io/app',
//   'https://xdai.gnosis-safe.io/app',
// ]

type MigrationMessageEvent = MessageEvent & {
  data: MigrationMessage
}

const StoreMigrator = (): ReactElement => {
  const [currentNetwork, setCurrentNetwork] = useState(0)
  const dispatch = useDispatch()

  // Add an event listener to recieve the data to be migrated and save it into the storage
  useEffect(() => {
    const saveEventData = async (event: MigrationMessageEvent) => {
      const isTrustedOrigin = networks.some((network) => {
        return network.includes(event.origin)
      })
      const executeMigration = event.data.executeMigration
      const isValidOrigin = event.origin !== self.origin && isTrustedOrigin
      if (executeMigration && isValidOrigin) {
        try {
          const payload = JSON.parse(event.data.payload)
          const promises = Object.keys(payload).map(async (key) => {
            const payloadEntry = JSON.parse(payload[key])
            if (key === 'SAFE__addressBook') {
              dispatch(addressBookMigrate(payloadEntry))
            } else if (key.startsWith('_immortal|v2_')) {
              // _immortal is automatically added by Immortal library so the basic key shouldn't contain this
              const storageKey = key.replace('_immortal|', '')
              // Save entry in localStorage
              await saveMigratedKeyToStorage(storageKey, payloadEntry)
            }
          })
          await Promise.all(promises)
          setCurrentNetwork((prevState) => prevState + 1)
        } catch (error) {
          logError(Errors._703, error.message)
        }
      } else if (executeMigration === false && isValidOrigin) {
        // We need executeMigration to be explicitly defined to ensure is the event we are looking for
        setCurrentNetwork((prevState) => prevState + 1)
      }
    }

    window.addEventListener('message', saveEventData, false)
    return () => window.removeEventListener('message', saveEventData, false)
  }, [dispatch])

  // We check that we are in the main domain in order to load the iframe
  const isMainDomainApp =
    MAINET_URL.includes(self.origin) &&
    networks.some((network) => {
      return !network.includes(self.origin)
    })

  // Open another network in the iframe to migrate local storage
  useEffect(() => {
    if (isMainDomainApp && currentNetwork < networks.length) {
      const urlToMigrate = `${networks[currentNetwork]}/#${MIGRATION_ADDRESS}`
      window.open(urlToMigrate, 'targetWindow')
    }
  }, [currentNetwork, isMainDomainApp])

  return (
    <div>
      {isMainDomainApp && currentNetwork < networks.length && (
        <iframe width="0" height="0" name="targetWindow" id="targetWindow"></iframe>
      )}
    </div>
  )
}

export default StoreMigrator
