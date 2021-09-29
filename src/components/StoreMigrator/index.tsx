import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getNetworkLabel } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { saveMigratedKeyToStorage } from 'src/utils/storage'

const getNetworkUrl = (network: string): string => {
  const hostname = location.hostname

  if (hostname.includes('gnosis-safe.io')) {
    return `https://${network}.gnosis-safe.io`
  } else if (hostname.includes('staging.gnosisdev.com')) {
    return `https://safe-team-${network}.staging.gnosisdev.com`
  } else if (hostname.includes('review.gnosisdev.com')) {
    return `https://pr2774--safereact.review.gnosisdev.com/${network}`
  } else if (hostname.includes('localhost')) {
    return `http://localhost:3001/${network}`
  } else {
    return ''
  }
}

const networks = Object.values(ETHEREUM_NETWORK).map(getNetworkLabel)

type MigrationMessageEvent = MessageEvent & {
  data: { payload: string }
}

const StoreMigrator = (): ReactElement | null => {
  const [currentNetwork, setCurrentNetwork] = useState(0)
  const dispatch = useDispatch()

  // Add an event listener to recieve the data to be migrated and save it into the storage
  useEffect(() => {
    const saveEventData = async (event: MigrationMessageEvent) => {
      const isTrustedOrigin = networks.some((network) => getNetworkUrl(network).includes(event.origin))
      const isValidOrigin = event.origin !== self.origin && isTrustedOrigin

      if (!isValidOrigin) return

      try {
        const payload = JSON.parse(event.data.payload)

        const promises = Object.keys(payload).map(async (key) => {
          const payloadEntry = JSON.parse(payload[key])

          const isAddressBook = key === 'SAFE__addressBook'
          const isImmortal = key.startsWith('_immortal|v2_')

          if (isAddressBook) {
            dispatch(addressBookMigrate(payloadEntry))
          } else if (isImmortal) {
            // _immortal is automatically added by Immortal library so the basic key shouldn't contain this
            const storageKey = key.replace('_immortal|', '')
            // Save entry in localStorage
            await saveMigratedKeyToStorage(storageKey, payloadEntry)
          }
        })

        await Promise.all(promises)
      } catch (error) {
        logError(Errors._703, error.message)
      }

      setCurrentNetwork((prevState) => prevState + 1)
    }

    window.addEventListener('message', saveEventData, false)
    return () => window.removeEventListener('message', saveEventData, false)
  }, [dispatch])

  const shouldMigrate = currentNetwork < networks.length
  // Open another network in the iframe to migrate local storage
  useEffect(() => {
    if (shouldMigrate) {
      const urlToMigrate = `${getNetworkUrl(networks[currentNetwork])}/migrate-local-storage.html`
      window.open(urlToMigrate, 'targetWindow')
    }
  }, [shouldMigrate])

  return shouldMigrate ? <iframe width="0" height="0" name="targetWindow" id="targetWindow"></iframe> : null
}

export default StoreMigrator
