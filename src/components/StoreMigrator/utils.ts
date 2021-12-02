import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { Errors, trackError } from 'src/logic/exceptions/CodedException'

const MIGRATION_KEY = 'SAFE__migratedNetworks'
const ADDRESS_BOOK_KEY = 'SAFE__addressBook'
const IMMORTAL_PREFIX = '_immortal|'
const MAINNET_PREFIX = 'MAINNET'

const networks = ['arbitrum', 'bsc', 'ewc', 'polygon', 'rinkeby', 'volta', 'xdai'] as const
export type NETWORK_TO_MIGRATE = typeof networks[number]

export function getSubdomainUrl(network: NETWORK_TO_MIGRATE): string {
  const hostname = location.hostname

  if (hostname === 'gnosis-safe.io') {
    return `https://${network}.gnosis-safe.io/app`
  } else if (hostname.includes('staging.gnosisdev.com')) {
    return `https://safe-team-${network}.staging.gnosisdev.com/app`
  } else if (hostname.includes('dev.gnosisdev.com')) {
    return `https://safe-team.dev.gnosisdev.com/app`
  } else if (hostname.includes('localhost')) {
    return 'http://localhost:3001/app'
  } else {
    return ''
  }
}

function getMigratedNetworks(): NETWORK_TO_MIGRATE[] {
  let migratedNetworks: NETWORK_TO_MIGRATE[]
  try {
    const item = localStorage.getItem(MIGRATION_KEY)
    migratedNetworks = item ? JSON.parse(item) : []
  } catch (e) {
    migratedNetworks = []
  }
  return migratedNetworks
}

export function addMigratedNetwork(network: NETWORK_TO_MIGRATE): void {
  const migratedNetworks = getMigratedNetworks()
  if (migratedNetworks.includes(network)) {
    return
  }
  const newValue = [...migratedNetworks, network]
  localStorage.setItem(MIGRATION_KEY, JSON.stringify(newValue))
}

export function getNetworksToMigrate(): NETWORK_TO_MIGRATE[] {
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
    trackError(Errors._703, `${e.message} – ${entry}`)
    return null
  }
}

function isSameOrigin(event: MessageEvent): boolean {
  return event.origin === self.origin
}

function isTrustedOrigin(event: MessageEvent): boolean {
  return networks.some((network) => getSubdomainUrl(network).startsWith(event.origin))
}

export function handleMessage(
  event: MessageEvent & { data: { payload: string } },
  receivedCallback: () => void,
  addressBookCallback: (data: AddressBookState) => void,
  immortalDataCallback: (key: string, value: unknown) => void,
): void {
  if (!event.data.payload) return
  if (isSameOrigin(event) || !isTrustedOrigin(event)) return

  // Message acknowledged
  receivedCallback()

  // Parse the JSON payload
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
  Object.keys(payload)
    .filter((key) => key.startsWith(IMMORTAL_PREFIX) && !key.includes(MAINNET_PREFIX))
    .forEach((key) => {
      const data = parsePayload<unknown>(payload[key])
      if (data == null) return

      // _immortal is automatically added by Immortal library so the basic key shouldn't contain this
      const storageKey = key.replace(IMMORTAL_PREFIX, '')
      // Save entry in localStorage
      immortalDataCallback(storageKey, data)
    })
}
