import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { Errors, trackError } from 'src/logic/exceptions/CodedException'
import { saveMigratedKeyToStorage } from 'src/utils/storage'

type MigrationMessageEvent = MessageEvent & {
  data: { payload: string }
}

const MIGRATION_KEY = 'SAFE__migratedNetworks'
const ADDRESS_BOOK_KEY = 'SAFE__addressBook'
const IFRAME_PATH = '/migrate-local-storage.html'
const networks = ['bsc', 'polygon', 'ewc', 'rinkeby', 'xdai']

const getSubdomainUrl = (network: string): string => {
  const hostname = location.hostname

  if (hostname.includes('gnosis-safe.io')) {
    return 'https://gnosis-safe.io/app'
  } else if (hostname.includes('staging.gnosisdev.com')) {
    return `https://safe-team-${network}.staging.gnosisdev.com/app`
  } else if (hostname.includes('review.gnosisdev.com')) {
    return `https://pr2778--safereact.review.gnosisdev.com/${network}/app/`
  } else if (hostname.includes('localhost')) {
    return 'http://localhost:3001'
  } else {
    return ''
  }
}

const getMigratedNetworks = (): string[] => {
  let migratedNetworks: string[]
  try {
    const item = localStorage.getItem(MIGRATION_KEY)
    migratedNetworks = item ? JSON.parse(item) : []
  } catch (e) {
    migratedNetworks = []
  }
  return migratedNetworks
}

const addMigratedNetwork = (network: string): string[] => {
  const migratedNetworks = getMigratedNetworks()
  if (migratedNetworks.includes(network)) {
    return migratedNetworks
  }
  const newValue = [...migratedNetworks, network]
  localStorage.setItem(MIGRATION_KEY, JSON.stringify(newValue))
  return newValue
}

const isNetworkSubdomain = (): boolean => {
  const { href } = location
  return networks.map(getSubdomainUrl).some((url) => href.startsWith(url))
}

function parsePayload<T>(entry: string): T | null {
  try {
    return JSON.parse(entry) as T
  } catch (e) {
    trackError(Errors._703, e.message)
    return null
  }
}

const StoreMigrator = (): ReactElement | null => {
  const dispatch = useDispatch()
  const [networksToMigrate, setNetworksToMigrate] = useState<string[]>([])

  useEffect(() => {
    if (isNetworkSubdomain()) {
      return
    }
    const migrated = getMigratedNetworks()
    const remaining = networks.filter((network) => !migrated.includes(network))
    setNetworksToMigrate(remaining)
  }, [])

  // Add an event listener to recieve the data to be migrated and save it into the storage
  useEffect(() => {
    if (!networksToMigrate.length) {
      return
    }

    const saveEventData = async (event: MigrationMessageEvent) => {
      const isTrustedOrigin = networks.some((network) => getSubdomainUrl(network).includes(event.origin))
      const isValidOrigin = event.origin !== self.origin && isTrustedOrigin
      if (!isValidOrigin) return

      const payload = parsePayload<Record<string, string>>(event.data.payload)
      if (!payload) {
        return
      }

      // Migrate the address book
      const addressBookData = parsePayload<AddressBookState>(payload[ADDRESS_BOOK_KEY])
      if (addressBookData) {
        dispatch(addressBookMigrate(addressBookData))
      }

      // Migrate the rest of the payload
      const immortalKeys = Object.keys(payload).filter((key) => key.startsWith('_immortal|v2_'))
      immortalKeys.forEach((key) => {
        const data = parsePayload<unknown>(payload[key])
        // _immortal is automatically added by Immortal library so the basic key shouldn't contain this
        const storageKey = key.replace('_immortal|', '')
        // Save entry in localStorage
        saveMigratedKeyToStorage(storageKey, data)
      })

      // Extract the network name
      const network = immortalKeys[0]?.split('_')[2]?.toLowerCase()
      if (network) {
        const migrated = addMigratedNetwork(network)

        // Clean up the iframes if all networks were migrated
        if (migrated.length === networks.length) {
          setNetworksToMigrate([])
        }
      }
    }

    window.addEventListener('message', saveEventData, false)

    return () => window.removeEventListener('message', saveEventData, false)
  }, [dispatch, networksToMigrate, setNetworksToMigrate])

  return (
    <>
      {networksToMigrate.map((network) => (
        <iframe key={network} width="0" height="0" hidden src={`${getSubdomainUrl(network)}${IFRAME_PATH}`} />
      ))}
    </>
  )
}

export default StoreMigrator
