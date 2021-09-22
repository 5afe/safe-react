import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { MigrationMessage } from 'src/routes/migration/container'
import { MIGRATION_ADDRESS } from 'src/routes/routes'
import { saveToStorage } from 'src/utils/storage'

const MAINET_URL = 'https://pr2695--safereact.review.gnosisdev.com/mainnet/app'
const networks = [
  {
    safeUrl: 'https://pr2729--safereact.review.gnosisdev.com/polygon/app',
  },
  {
    safeUrl: 'https://pr2730--safereact.review.gnosisdev.com/rinkeby/app',
  },
]

type MigrationMessageEvent = MessageEvent & {
  data: MigrationMessage
}

const StoreMigrator: React.FC = () => {
  const [currentNetwork, setCurrentNetwork] = useState(0)
  const dispatch = useDispatch()
  //let networks = getNetworks()

  // Recieve the data to be migrated and save it into the localstorage
  useEffect(() => {
    const saveEventData = async (event: MigrationMessageEvent) => {
      const isTrustedOrigin = networks.some((network) => {
        return network.safeUrl.includes(event.origin)
      })
      const isRightOrigin = event.origin !== self.origin && isTrustedOrigin
      if (event.data.migrate && isRightOrigin) {
        try {
          const payload = JSON.parse(event.data.payload)
          const promises = Object.keys(payload).map(async (key) => {
            const payloadEntry = JSON.parse(payload[key])
            if (key === 'SAFE__addressBook') {
              dispatch(addressBookMigrate(JSON.parse(payloadEntry)))
            } else if (key.startsWith('_immortal|v2_')) {
              // Save entry in localStorage
              await saveToStorage(key, payloadEntry)
              localStorage.setItem(key, payloadEntry)
            }
          })
          await Promise.all(promises)
          setCurrentNetwork(currentNetwork + 1)
        } catch (error) {
          logError(Errors._703, error.message)
        }
      }
    }

    window.addEventListener('message', saveEventData, false)
    return () => window.removeEventListener('message', saveEventData, false)
  }, [currentNetwork, dispatch])

  const isSingleNetworkApp = networks.some((network) => {
    return !MAINET_URL.includes(self.origin) && network.safeUrl.includes(self.origin)
  })
  // Migrate local storage
  useEffect(() => {
    console.log(console.log(isSingleNetworkApp))
    if (!isSingleNetworkApp && currentNetwork < networks.length) {
      const urlToMigrate = `${networks[currentNetwork].safeUrl}/#${MIGRATION_ADDRESS}`
      console.log('Url To migrate:', urlToMigrate)
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
