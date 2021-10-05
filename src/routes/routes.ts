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

export const getPrefixedSafeAddressSlug = (
  safeAddress = getSafeAddressFromUrl(),
  shortName = getShortChainNameFromUrl() || getCurrentShortChainName(),
): string => {
  return `${shortName}:${safeAddress}`
}

// Safe specific routes
const chainSpecificSafeAddressPathRegExp = '[a-z]+:0x[0-9a-zA-Z]+'
const SAFE_ADDRESS_SLUG = `prefixedSafeAddress`
export const ADDRESSED_ROUTE = `/:${SAFE_ADDRESS_SLUG}(${chainSpecificSafeAddressPathRegExp})`

// Safe section routes, i.e. /:prefixedSafeAddress/settings
const SAFE_SECTION_SLUG = 'safeSection'
export const SAFE_SECTION_ROUTE = `${ADDRESSED_ROUTE}/:${SAFE_SECTION_SLUG}`

// Safe subsection routes, i.e. /:prefixedSafeAddress/settings/advanced
export const SAFE_SUBSECTION_SLUG = 'safeSubsection'
export const SAFE_SUBSECTION_ROUTE = `${SAFE_SECTION_ROUTE}/:${SAFE_SUBSECTION_SLUG}`

// URL: gnosis-safe.io/app/:[SAFE_ADDRESS_SLUG]/:[SAFE_SECTION_SLUG]/:[SAFE_SUBSECTION_SLUG]
export type SafeRouteSlugs = {
  [SAFE_ADDRESS_SLUG]?: string
  [SAFE_SECTION_SLUG]?: string
  [SAFE_SUBSECTION_SLUG]?: string
}

// Routes independant of safe/network
export const WELCOME_ROUTE = '/welcome'
export const OPEN_ROUTE = '/open'
export const LOAD_ROUTE = '/load'

// Load safe from URL
export const LOAD_SPECIFIC_SAFE_ROUTE = `${ADDRESSED_ROUTE}${LOAD_ROUTE}`

// [SAFE_SECTION_SLUG], [SAFE_SUBSECTION_SLUG] populated safe routes
export const SAFE_ROUTES = {
  ASSETS_BALANCES: `${ADDRESSED_ROUTE}/balances`, // [SAFE_SECTION_SLUG] === 'balances'
  ASSETS_BALANCES_COLLECTIBLES: `${ADDRESSED_ROUTE}/balances/collectibles`, // [SAFE_SUBSECTION_SLUG] === 'collectibles'
  TRANSACTIONS: `${ADDRESSED_ROUTE}/transactions`,
  ADDRESS_BOOK: `${ADDRESSED_ROUTE}/address-book`,
  APPS: `${ADDRESSED_ROUTE}/apps`,
  SETTINGS: `${ADDRESSED_ROUTE}/settings`,
  SETTINGS_DETAILS: `${ADDRESSED_ROUTE}/settings/details`,
  SETTINGS_OWNERS: `${ADDRESSED_ROUTE}/settings/owners`,
  SETTINGS_POLICIES: `${ADDRESSED_ROUTE}/settings/policies`,
  SETTINGS_SPENDING_LIMIT: `${ADDRESSED_ROUTE}/settings/spending-limit`,
  SETTINGS_ADVANCED: `${ADDRESSED_ROUTE}/settings/advanced`,
}

export type SafeRouteParams = { shortChainName: string; safeAddress: string }

// Populate `/:[SAFE_ADDRESS_SLUG]` with current 'shortChainName:safeAddress'
export const generateSafeRoute = (
  path: typeof SAFE_ROUTES[keyof typeof SAFE_ROUTES],
  { shortChainName = getCurrentShortChainName(), safeAddress = getSafeAddressFromUrl() }: SafeRouteParams,
): string =>
  generatePath(path, {
    [SAFE_ADDRESS_SLUG]: `${shortChainName}:${safeAddress}`,
  })

export const getAllSafeRoutesWithPrefixedAddress = (params: SafeRouteParams) =>
  Object.entries(SAFE_ROUTES).reduce<typeof SAFE_ROUTES>((routes, [key, route]) => {
    return {
      ...routes,
      [key]: generateSafeRoute(route, params),
    }
  }, {} as typeof SAFE_ROUTES)
