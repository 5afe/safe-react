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

// Due to hoisting issues, these functions should remain here
export const getPrefixedSafeAddressFromUrl = (): { shortName: string; safeAddress: string } => {
  const match = matchPath<SafeRouteSlugs>(history.location.pathname, { path: ADDRESSED_ROUTE })
  const prefixedSafeAddress = match?.params?.[SAFE_ADDRESS_SLUG]?.split(':')
  const currentShortChainName = getCurrentShortChainName()

  const getValidSafeAddress = (safeAddress?: string) =>
    safeAddress && isChecksumAddress(safeAddress) ? safeAddress : ''

  if (prefixedSafeAddress?.length === 1) {
    return {
      shortName: currentShortChainName,
      safeAddress: getValidSafeAddress(prefixedSafeAddress?.[0]),
    }
  }
  return {
    shortName: prefixedSafeAddress?.[0] || currentShortChainName,
    safeAddress: getValidSafeAddress(prefixedSafeAddress?.[1]),
  }
}

export const hasPrefixedSafeAddressInUrl = (): boolean => {
  const match = matchPath<SafeRouteSlugs>(history.location.pathname, { path: ADDRESSED_ROUTE })
  return !!match?.params?.[SAFE_ADDRESS_SLUG]
}

export const isValidShortChainName = (shortName: string): boolean => {
  const shortNames = getNetworks().map(({ shortName }) => shortName)
  return shortNames.includes(shortName)
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

export const getShortChainNameFromUrl = (): string => getPrefixedSafeAddressFromUrl().shortName
export const getSafeAddressFromUrl = (): string => getPrefixedSafeAddressFromUrl().safeAddress

export const getPrefixedSafeAddressSlug = (
  safeAddress = getSafeAddressFromUrl(),
  shortName = getShortChainNameFromUrl() || getCurrentShortChainName(),
): string => {
  return `${shortName}:${safeAddress}`
}

export type SafeRouteParams = { shortChainName: string; safeAddress: string }

// Populate `/:[SAFE_ADDRESS_SLUG]` with current 'shortChainName:safeAddress'
export const generateSafeRoute = (
  path: typeof SAFE_ROUTES[keyof typeof SAFE_ROUTES],
  { shortChainName, safeAddress }: SafeRouteParams,
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
