import { createBrowserHistory } from 'history'
import { generatePath } from 'react-router-dom'
import { getCurrentShortChainName, getNetworks } from 'src/config'
import { isChecksumAddress, checksumAddress } from 'src/utils/checksumAddress'

import { PUBLIC_URL } from 'src/utils/constants'
import { sameString } from 'src/utils/strings'

export const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

// Due to hoisting issues, these functions should remain here
export const getPrefixedSafeAddressFromUrl = (): { shortName: string; safeAddress: string } => {
  const chainSpecificAddress = history.location.pathname.split('/').filter(Boolean)

  if (!chainSpecificAddress?.length) {
    return { shortName: '', safeAddress: '' }
  }

  const [prefix, address] = chainSpecificAddress[0].split(':')

  return {
    shortName: isValidShortChainName(prefix) ? prefix : getCurrentShortChainName(),
    safeAddress: isChecksumAddress(prefix) ? checksumAddress(address).toString() : '',
  }
}

export const isValidShortChainName = (shortName: string): boolean => {
  const shortNames = getNetworks().map(({ shortName }) => shortName)
  return shortNames.some((name) => sameString(name, shortName))
}

export const isValidChainSpecificAddress = (chainSpecificAddress: string): boolean => {
  const parts = chainSpecificAddress?.split(':')?.filter(Boolean)

  if (parts?.length === 2) {
    const [shortName, address] = parts
    return isValidShortChainName(shortName) && isChecksumAddress(address)
  } else {
    return false
  }
}

const getShortChainNameFromUrl = (): string => {
  const { shortName } = getPrefixedSafeAddressFromUrl()
  return isValidShortChainName(shortName) ? shortName : getCurrentShortChainName()
}
export const getSafeAddressFromUrl = (): string => getPrefixedSafeAddressFromUrl().safeAddress

export const getPrefixedSafeAddressSlug = (safeAddress = getSafeAddressFromUrl()): string => {
  const shortName = getShortChainNameFromUrl() || getCurrentShortChainName()
  return `${shortName}:${safeAddress}`
}

// Routes independant of safe/network
export const WELCOME_ROUTE = '/welcome'
export const OPEN_ROUTE = '/open'
export const LOAD_ROUTE = '/load'

// Safe specific routes
const chainSpecificSafeAddressPathRegExp = '[a-z]+:0x[0-9a-zA-Z]+'
export const SAFE_ADDRESS_SLUG = `prefixedSafeAddress`
export const SAFE_ROUTE = `/:${SAFE_ADDRESS_SLUG}(${chainSpecificSafeAddressPathRegExp})`

// Safe section routes, i.e. /:prefixedSafeAddress/settings
export const SAFE_SECTION_SLUG = 'safeSection'
export const SAFE_SECTION_ROUTE = `${SAFE_ROUTE}/:${SAFE_SECTION_SLUG}`

// Safe subsection routes, i.e. /:prefixedSafeAddress/settings/advanced
export const SAFE_SUBSECTION_SLUG = 'safeSubsection'
export const SAFE_SUBSECTION_ROUTE = `${SAFE_SECTION_ROUTE}/:${SAFE_SUBSECTION_SLUG}`

// URL: gnosis-safe.io/app/:[SAFE_ADDRESS_SLUG]/:[SAFE_SECTION_SLUG]/:[SAFE_SUBSECTION_SLUG]
export type SafeRouteSlugs = {
  [SAFE_ADDRESS_SLUG]?: string
  [SAFE_SECTION_SLUG]?: string
  [SAFE_SUBSECTION_SLUG]?: string
}

// [SAFE_SECTION_SLUG], [SAFE_SUBSECTION_SLUG] populated safe routes
export const SAFE_ROUTES = {
  ASSETS_BALANCES: `${SAFE_ROUTE}/balances`, // [SAFE_SECTION_SLUG] === 'balances'
  ASSETS_BALANCES_COLLECTIBLES: `${SAFE_ROUTE}/balances/collectibles`, // [SAFE_SUBSECTION_SLUG] === 'collectibles'
  TRANSACTIONS: `${SAFE_ROUTE}/transactions`,
  ADDRESS_BOOK: `${SAFE_ROUTE}/address-book`,
  APPS: `${SAFE_ROUTE}/apps`,
  SETTINGS: `${SAFE_ROUTE}/settings`,
  SETTINGS_DETAILS: `${SAFE_ROUTE}/settings/details`,
  SETTINGS_OWNERS: `${SAFE_ROUTE}/settings/owners`,
  SETTINGS_POLICIES: `${SAFE_ROUTE}/settings/policies`,
  SETTINGS_SPENDING_LIMIT: `${SAFE_ROUTE}/settings/spending-limit`,
  SETTINGS_ADVANCED: `${SAFE_ROUTE}/settings/advanced`,
}

// Populate `/:[SAFE_ADDRESS_SLUG]` with current 'shortChainName:safeAddress'
export const generateSafeRoute = (
  path: typeof SAFE_ROUTES[keyof typeof SAFE_ROUTES],
  params: SafeRouteSlugs = {},
): string =>
  generatePath(path, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug(),
    ...params,
  })

// Routes with populated `/:[SAFE_ADDRESS_SLUG]`
export const SAFE_ROUTE_WITH_ADDRESS = generateSafeRoute(SAFE_ROUTE)
export const SAFE_ROUTES_WITH_ADDRESS = Object.entries(SAFE_ROUTES).reduce<typeof SAFE_ROUTES>(
  (routes, [key, route]) => ({ ...routes, [key]: generateSafeRoute(route) }),
  {} as typeof SAFE_ROUTES,
)
