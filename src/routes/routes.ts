import { createBrowserHistory } from 'history'
import { generatePath, matchPath } from 'react-router-dom'

import { getChains } from 'src/config/cache/chains'
import { ChainId, ShortName } from 'src/config/chain.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { PUBLIC_URL } from 'src/utils/constants'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'

export const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

// Safe specific routes
const hashRegExp = '0x[0-9A-Fa-f]'

const chainSpecificSafeAddressPathRegExp = `[a-z0-9-]{2,}:${hashRegExp}{40}`

export const SAFE_ADDRESS_SLUG = 'prefixedSafeAddress'
export const ADDRESSED_ROUTE = `/:${SAFE_ADDRESS_SLUG}(${chainSpecificSafeAddressPathRegExp})`

// Safe section routes, i.e. /:prefixedSafeAddress/settings
const SAFE_SECTION_SLUG = 'safeSection'
export const SAFE_SECTION_ROUTE = `${ADDRESSED_ROUTE}/:${SAFE_SECTION_SLUG}`

// Safe subsection routes, i.e. /:prefixedSafeAddress/settings/advanced
export const SAFE_SUBSECTION_SLUG = 'safeSubsection'
export const SAFE_SUBSECTION_ROUTE = `${SAFE_SECTION_ROUTE}/:${SAFE_SUBSECTION_SLUG}`

export const TRANSACTION_ID_SLUG = `safeTxHash`

// URL: gnosis-safe.io/app/:[SAFE_ADDRESS_SLUG]/:[SAFE_SECTION_SLUG]/:[SAFE_SUBSECTION_SLUG]
export type SafeRouteSlugs = {
  [SAFE_ADDRESS_SLUG]?: string
  [SAFE_SECTION_SLUG]?: string
  [SAFE_SUBSECTION_SLUG]?: string
  [TRANSACTION_ID_SLUG]?: string
}

export const LOAD_SPECIFIC_SAFE_ROUTE = `/load/:${SAFE_ADDRESS_SLUG}?` // ? = optional slug

// Routes independant of safe/network
export const ROOT_ROUTE = '/'
export const WELCOME_ROUTE = '/welcome'
export const OPEN_SAFE_ROUTE = '/open'
export const LOAD_SAFE_ROUTE = generatePath(LOAD_SPECIFIC_SAFE_ROUTE) // By providing no slug, we get '/load'

// [SAFE_SECTION_SLUG], [SAFE_SUBSECTION_SLUG] populated safe routes
export const SAFE_ROUTES = {
  ASSETS_BALANCES: `${ADDRESSED_ROUTE}/balances`, // [SAFE_SECTION_SLUG] === 'balances'
  ASSETS_BALANCES_COLLECTIBLES: `${ADDRESSED_ROUTE}/balances/collectibles`, // [SAFE_SUBSECTION_SLUG] === 'collectibles'
  TRANSACTIONS: `${ADDRESSED_ROUTE}/transactions`,
  TRANSACTIONS_HISTORY: `${ADDRESSED_ROUTE}/transactions/history`,
  TRANSACTIONS_QUEUE: `${ADDRESSED_ROUTE}/transactions/queue`,
  TRANSACTIONS_SINGULAR: `${ADDRESSED_ROUTE}/transactions/:${TRANSACTION_ID_SLUG}(${hashRegExp}+)`, // [TRANSACTION_HASH_SLUG] === 'safeTxHash'
  ADDRESS_BOOK: `${ADDRESSED_ROUTE}/address-book`,
  APPS: `${ADDRESSED_ROUTE}/apps`,
  SETTINGS: `${ADDRESSED_ROUTE}/settings`,
  SETTINGS_APPEARANCE: `${ADDRESSED_ROUTE}/settings/appearance`,
  SETTINGS_DETAILS: `${ADDRESSED_ROUTE}/settings/details`,
  SETTINGS_OWNERS: `${ADDRESSED_ROUTE}/settings/owners`,
  SETTINGS_POLICIES: `${ADDRESSED_ROUTE}/settings/policies`,
  SETTINGS_SPENDING_LIMIT: `${ADDRESSED_ROUTE}/settings/spending-limit`,
  SETTINGS_ADVANCED: `${ADDRESSED_ROUTE}/settings/advanced`,
}

export const getNetworkRootRoutes = (): Array<{ chainId: ChainId; route: string; shortName: string }> =>
  getChains().map(({ chainId, chainName, shortName }) => ({
    chainId,
    route: `/${chainName.replace(/\s+/g, '-').toLowerCase()}`,
    shortName,
  }))

export type SafeRouteParams = { shortName: ShortName; safeAddress: string }

export const isValidShortChainName = (shortName: ShortName): boolean => {
  return getChains().some((chain) => chain.shortName === shortName)
}

// Due to hoisting issues, these functions should remain here
export const extractPrefixedSafeAddress = (
  path = history.location.pathname,
  route = ADDRESSED_ROUTE,
): SafeRouteParams => {
  const match = matchPath<SafeRouteSlugs>(path, {
    path: route,
  })

  const prefixedSafeAddress = match?.params?.[SAFE_ADDRESS_SLUG]
  const { prefix, address } = parsePrefixedAddress(prefixedSafeAddress || '')

  return {
    shortName: prefix,
    safeAddress: checksumAddress(address),
  }
}

export const extractShortChainName = (): ShortName => extractPrefixedSafeAddress().shortName
export const extractSafeAddress = (): string => extractPrefixedSafeAddress().safeAddress

export const getPrefixedSafeAddressSlug = (
  { safeAddress = extractSafeAddress(), shortName = extractShortChainName() } = {
    safeAddress: extractSafeAddress(),
    shortName: extractShortChainName(),
  },
): string => `${shortName}:${safeAddress}`

// Populate `/:[SAFE_ADDRESS_SLUG]` with current 'shortName:safeAddress'
export const generateSafeRoute = (
  path: typeof SAFE_ROUTES[keyof typeof SAFE_ROUTES],
  params: SafeRouteParams,
): string =>
  generatePath(path, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug(params),
  })

// Singular tx route is excluded as it has a required safeTxHash slug
// This is to give stricter routing, instead of making the slug optional
const { TRANSACTIONS_SINGULAR: _hasRequiredSlug, ...STANDARD_SAFE_ROUTES } = SAFE_ROUTES
export const generatePrefixedAddressRoutes = (params: SafeRouteParams): typeof STANDARD_SAFE_ROUTES => {
  return Object.entries(STANDARD_SAFE_ROUTES).reduce<typeof STANDARD_SAFE_ROUTES>(
    (routes, [key, route]) => ({ ...routes, [key]: generateSafeRoute(route, params) }),
    {} as typeof STANDARD_SAFE_ROUTES,
  )
}
