import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { Errors, trackError } from 'src/logic/exceptions/CodedException'

const MIGRATION_KEY = 'SAFE__migratedNetworks'
const ADDRESS_BOOK_KEY = 'SAFE__addressBook'
const IMMORTAL_PREFIX = '_immortal|'
const networks = ['bsc', 'polygon', 'ewc', 'rinkeby', 'xdai']

export function getSubdomainUrl(network: string): string {
  const hostname = location.hostname

  if (hostname.includes('gnosis-safe.io')) {
    return `https://${network}.gnosis-safe.io/app`
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

function getMigratedNetworks(): string[] {
  let migratedNetworks: string[]
  try {
    const item = localStorage.getItem(MIGRATION_KEY)
    migratedNetworks = item ? JSON.parse(item) : []
  } catch (e) {
    migratedNetworks = []
  }
  return migratedNetworks
}

function addMigratedNetwork(network: string): string[] {
  const migratedNetworks = getMigratedNetworks()
  if (migratedNetworks.includes(network)) {
    return migratedNetworks
  }
  const newValue = [...migratedNetworks, network]
  localStorage.setItem(MIGRATION_KEY, JSON.stringify(newValue))
  return newValue
}

export function getNetworksToMigrate(): string[] {
  const migrated = getMigratedNetworks()
  const remaining = networks.filter((network) => !migrated.includes(network))
  return remaining
}

export function isNetworkSubdomain(): boolean {
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

export function handleMessage(
  event: MessageEvent,
  addressBookCallback: (data: AddressBookState) => void,
  immortalDataCallback: (key: string, value: unknown) => void,
  doneCallback: () => void,
): void {
  const isTrustedOrigin = networks.some((network) => getSubdomainUrl(network).startsWith(event.origin))
  const isValidOrigin = event.origin !== self.origin && isTrustedOrigin
  if (!isValidOrigin) return

  const payload = parsePayload<Record<string, string>>(event.data.payload)
  if (!payload) {
    return
  }

  // Migrate the address book
  const addressBookData = parsePayload<AddressBookState>(payload[ADDRESS_BOOK_KEY])
  if (addressBookData) {
    addressBookCallback(addressBookData)
  }

  // Migrate the rest of the payload
  const immortalKeys = Object.keys(payload).filter((key) => key.startsWith(IMMORTAL_PREFIX))
  immortalKeys.forEach((key) => {
    const data = parsePayload<unknown>(payload[key])
    // _immortal is automatically added by Immortal library so the basic key shouldn't contain this
    const storageKey = key.replace(IMMORTAL_PREFIX, '')
    // Save entry in localStorage
    immortalDataCallback(storageKey, data)
  })

  // Extract the network name
  const network = immortalKeys[0]?.split('_')[2]?.toLowerCase()
  if (network) {
    const migrated = addMigratedNetwork(network)

    // Clean up the iframes if all networks were migrated
    if (migrated.length === networks.length) {
      doneCallback()
    }
  }
}
