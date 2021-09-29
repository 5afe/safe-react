import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { saveMigratedKeyToStorage } from 'src/utils/storage'
import allNetworks from 'src/config/networks'

type MigrationMessageEvent = MessageEvent & {
  data: { payload: string }
}

const MIGRATION_KEY = 'SAFE__subdomainsMigrated'
const IFRAME_PATH = '/migrate-local-storage.html'
const IFRAME_NAME = 'migrationIframe'

// Take all networks except for local
const { local, ...migratedNetworks } = allNetworks
// The result is [ 'bsc', 'polygon', 'ewc', ... ]
const networks = Object.values(migratedNetworks).map(({ network }) => network.label.toLowerCase())

const getSubdomainUrl = (network: string): string => {
  const hostname = location.hostname

  if (hostname.includes('gnosis-safe.io')) {
    return network === 'mainnet' ? `https://gnosis-safe.io/app` : `https://${network}.gnosis-safe.io/app`
  } else if (hostname.includes('staging.gnosisdev.com')) {
    return `https://safe-team-${network}.staging.gnosisdev.com/app`
  } else if (hostname.includes('review.gnosisdev.com')) {
    return `https://pr2778--safereact.review.gnosisdev.com/${network}/app/`
  } else if (hostname.includes('localhost')) {
    return `http://localhost:3001`
  } else {
    return ''
  }
}

const isMigrationDone = (): boolean => {
  return Boolean(localStorage.getItem(MIGRATION_KEY))
}

const setMigrationDone = (): void => {
  localStorage.setItem(MIGRATION_KEY, 'true')
}

const getAddressBookEntry = (key: string, payloadEntry: unknown): AddressBookState | null => {
  const ADDRESS_BOOK_KEY = 'SAFE__addressBook'
  return key === ADDRESS_BOOK_KEY && Array.isArray(payloadEntry) ? (payloadEntry as AddressBookState) : null
}

const isNetworkSubdomain = (): boolean => {
  const { href } = location
  return networks.map(getSubdomainUrl).some((url) => href.startsWith(url))
}

const StoreMigrator = (): ReactElement | null => {
  const [currentNetworkIndex, setCurrentNetworkIndex] = useState(0)
  const dispatch = useDispatch()

  const onIframeError = () => {
    // Skip the network if its iframe errored out
    setCurrentNetworkIndex((prevState) => prevState + 1)
  }

  // Add an event listener to recieve the data to be migrated and save it into the storage
  useEffect(() => {
    if (isMigrationDone() || isNetworkSubdomain()) {
      // Skip the actual migration and make the iframe disappear
      setCurrentNetworkIndex(networks.length)
      return
    }

    const saveEventData = async (event: MigrationMessageEvent) => {
      const isTrustedOrigin = networks.some((network) => getSubdomainUrl(network).includes(event.origin))
      const isValidOrigin = event.origin !== self.origin && isTrustedOrigin
      if (!isValidOrigin) return

      let payload: Record<string, string> = {}
      try {
        payload = JSON.parse(event.data.payload)
      } catch (e) {
        logError(Errors._703, e.message)
      }

      Object.keys(payload).forEach((key) => {
        let payloadEntry: unknown
        try {
          payloadEntry = JSON.parse(payload[key])
        } catch (e) {
          return
        }

        const isImmortal = key.startsWith('_immortal|v2_')
        const addressBookState = !isImmortal && getAddressBookEntry(key, payloadEntry)

        if (addressBookState) {
          dispatch(addressBookMigrate(addressBookState))
        } else if (isImmortal) {
          // _immortal is automatically added by Immortal library so the basic key shouldn't contain this
          const storageKey = key.replace('_immortal|', '')
          // Save entry in localStorage
          saveMigratedKeyToStorage(storageKey, payloadEntry)
        }
      })

      setCurrentNetworkIndex((prevState) => prevState + 1)

      // If all networks were migrated, set a flag
      if (currentNetworkIndex === networks.length - 1) {
        setMigrationDone()
      }
    }

    window.addEventListener('message', saveEventData, false)
    return () => window.removeEventListener('message', saveEventData, false)
  }, [dispatch, setCurrentNetworkIndex])

  // Open another network in the iframe to migrate local storage
  useEffect(() => {
    if (currentNetworkIndex < networks.length) {
      const urlToMigrate = `${getSubdomainUrl(networks[currentNetworkIndex])}${IFRAME_PATH}`
      window.open(urlToMigrate, IFRAME_NAME)
    }
  }, [currentNetworkIndex])

  return currentNetworkIndex < networks.length ? (
    <iframe width="0" height="0" name={IFRAME_NAME} hidden onError={onIframeError}></iframe>
  ) : null
}

export default StoreMigrator
