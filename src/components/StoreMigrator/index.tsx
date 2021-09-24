import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// import { getNetworks } from 'src/config'
import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { MigrationMessage } from 'src/routes/migration/container'
import { MIGRATION_ADDRESS } from 'src/routes/routes'
import { saveMigratedKeyToStorage } from 'src/utils/storage'

const MAINET_URL = 'https://pr2695--safereact.review.gnosisdev.com/mainnet/app'
const networks = [
  {
    safeUrl: 'https://pr2730--safereact.review.gnosisdev.com/rinkeby/app',
  },
  {
    safeUrl: 'https://pr2729--safereact.review.gnosisdev.com/polygon/app',
  },
]

type MigrationMessageEvent = MessageEvent & {
  data: MigrationMessage
}

const StoreMigrator = (): ReactElement => {
  const [currentNetwork, setCurrentNetwork] = useState(0)
  const dispatch = useDispatch()
  // FIXME use this networks for staging and production
  // const configuredNetworks = getNetworks()

  // Add an event listener to recieve the data to be migrated and save it into the storage
  useEffect(() => {
    const saveEventData = async (event: MigrationMessageEvent) => {
      const isTrustedOrigin = networks.some((network) => {
        return network.safeUrl.includes(event.origin)
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
      } else if (executeMigration !== undefined && !executeMigration && isValidOrigin) {
        setCurrentNetwork((prevState) => prevState + 1)
      }
    }

    window.addEventListener('message', saveEventData, false)
    return () => window.removeEventListener('message', saveEventData, false)
  }, [dispatch])

  const isSingleNetworkApp = networks.some((network) => {
    return !MAINET_URL.includes(self.origin) && network.safeUrl.includes(self.origin)
  })

  // Open another network in the iframe to migrate local storage
  useEffect(() => {
    if (!isSingleNetworkApp && currentNetwork < networks.length) {
      const urlToMigrate = `${networks[currentNetwork].safeUrl}/#${MIGRATION_ADDRESS}`
      window.open(urlToMigrate, 'targetWindow')
    }
  }, [currentNetwork, isSingleNetworkApp])

  return (
    <div>
      {!isSingleNetworkApp && currentNetwork < networks.length && (
        <iframe width="0" height="0" name="targetWindow" id="targetWindow"></iframe>
      )}
    </div>
  )
}

export default StoreMigrator
