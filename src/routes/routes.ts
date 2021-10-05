import { createBrowserHistory } from 'history'
import { generatePath, matchPath } from 'react-router-dom'

import { getCurrentShortChainName, getNetworks } from 'src/config'
import { isChecksumAddress } from 'src/utils/checksumAddress'
import { PUBLIC_URL } from 'src/utils/constants'

export const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

// Safe specific routes
export const chainSpecificSafeAddressPathRegExp = '[a-z]+:0x[0-9A-Fa-f]+'
export const SAFE_ADDRESS_SLUG = 'prefixedSafeAddress'
export const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'

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
export const LOAD_ROUTE = `/load/:${SAFE_ADDRESS_SLUG}`

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

export type SafeRouteParams = { shortName: string; safeAddress: string }

const isValidShortChainName = (shortName?: string): boolean => {
  if (!shortName) return false
  const shortNames = getNetworks().map(({ shortName }) => shortName)
  return shortNames.includes(shortName)
}

const getValidShortName = (shortName?: string): string =>
  shortName && isValidShortChainName(shortName) ? shortName : ''
const getValidSafeAddress = (safeAddress?: string): string =>
  safeAddress && isChecksumAddress(safeAddress) ? safeAddress : ''

// Due to hoisting issues, these functions should remain here
export const getPrefixedSafeAddressFromUrl = (): SafeRouteParams => {
  const match = matchPath<SafeRouteSlugs>(history.location.pathname, { path: ADDRESSED_ROUTE })
  const prefixedSafeAddress = match?.params?.[SAFE_ADDRESS_SLUG]

  const currentShortChainName = getCurrentShortChainName()

  if (!prefixedSafeAddress) {
    return {
      shortName: currentShortChainName,
      safeAddress: '', // TODO: get this from the store if it exists
    }
  }

  if (isChecksumAddress(prefixedSafeAddress) || !prefixedSafeAddress.includes(':')) {
    return {
      shortName: currentShortChainName,
      safeAddress: getValidSafeAddress(prefixedSafeAddress),
    }
  }

  const parts = prefixedSafeAddress.split(':')

  if (parts.length === 1) {
    const safeAddress = prefixedSafeAddress?.[0]
    return {
      shortName: currentShortChainName,
      safeAddress: getValidSafeAddress(safeAddress),
    }
  } else {
    const shortName = prefixedSafeAddress?.[0]
    const safeAddress = prefixedSafeAddress?.[1]
    return {
      shortName: getValidShortName(shortName),
      safeAddress: getValidSafeAddress(safeAddress),
    }
  }
}

export const hasPrefixedSafeAddressInUrl = (): boolean => {
  const match = matchPath<SafeRouteSlugs>(history.location.pathname, { path: ADDRESSED_ROUTE })
  return !!match?.params?.[SAFE_ADDRESS_SLUG]
}

export const getShortChainNameFromUrl = (): string => getPrefixedSafeAddressFromUrl().shortName
export const getSafeAddressFromUrl = (): string => getPrefixedSafeAddressFromUrl().safeAddress

const DEFAULT_SAFE_ADDRESS = getSafeAddressFromUrl()
const DEFAULT_SHORT_NAME = getShortChainNameFromUrl() || getCurrentShortChainName()
const DEFAULT_PARAMS: Partial<SafeRouteParams> = {
  safeAddress: DEFAULT_SAFE_ADDRESS,
  shortName: DEFAULT_SHORT_NAME,
}
export const getPrefixedSafeAddressSlug = ({
  safeAddress = DEFAULT_SAFE_ADDRESS,
  shortName = DEFAULT_SHORT_NAME,
} = DEFAULT_PARAMS): string => `${shortName}:${safeAddress}`

// Populate `/:[SAFE_ADDRESS_SLUG]` with current 'shortName:safeAddress'
export const generateSafeRoute = (
  path: typeof SAFE_ROUTES[keyof typeof SAFE_ROUTES],
  { shortName, safeAddress }: SafeRouteParams,
): string =>
  generatePath(path, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug({ safeAddress, shortName }),
  })

export const getAllSafeRoutesWithPrefixedAddress = (params: SafeRouteParams): typeof SAFE_ROUTES =>
  Object.entries(SAFE_ROUTES).reduce<typeof SAFE_ROUTES>((routes, [key, route]) => {
    return {
      ...routes,
      [key]: generateSafeRoute(route, params),
    }
  }, {} as typeof SAFE_ROUTES)
