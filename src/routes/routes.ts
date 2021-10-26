import { createBrowserHistory } from 'history'
import { generatePath, matchPath } from 'react-router-dom'

import { getCurrentShortChainName } from 'src/config'
import networks from 'src/config/networks'
import { ETHEREUM_NETWORK, SHORT_NAME } from 'src/config/networks/network.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { PUBLIC_URL } from 'src/utils/constants'

export const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

// Safe specific routes
const chainSpecificSafeAddressPathRegExp = '[a-z0-9-]{2,}:0x[0-9A-Fa-f]{40}'

export const SAFE_ADDRESS_SLUG = 'prefixedSafeAddress'
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

// [{ id: '4', route: '/rinkeby'}]
// Mapping networks directly instead of getNetworks() due to hoisting issues
const { local: _, ...usefulNetworks } = networks
export const NETWORK_ROOT_ROUTES: Array<{ id: ETHEREUM_NETWORK; route: string }> = Object.values(usefulNetworks).map(
  ({ network: { id, label } }) => ({
    id,
    route: `/${label.toLowerCase()}`,
  }),
)

export type SafeRouteParams = { shortName: string; safeAddress: string }

export const isValidShortChainName = (shortName: string): boolean => {
  const shortNames: string[] = Object.values(SHORT_NAME)
  return shortNames.includes(shortName)
}

// Due to hoisting issues, these functions should remain here
export const extractPrefixedSafeAddress = (
  path = history.location.pathname,
  route = ADDRESSED_ROUTE,
): SafeRouteParams => {
  const currentChainShortName = getCurrentShortChainName()

  const match = matchPath<SafeRouteSlugs>(path, {
    path: route,
  })

  const prefixedSafeAddress = match?.params?.[SAFE_ADDRESS_SLUG]
  const parts = prefixedSafeAddress?.split(':')?.filter(Boolean)

  if (!prefixedSafeAddress || !parts?.length) {
    return {
      shortName: currentChainShortName,
      safeAddress: '',
    }
  }

  const isChainSpecificAddress = parts.length === 2
  const shortName = isChainSpecificAddress ? parts[0] : currentChainShortName
  const safeAddress = isChainSpecificAddress ? parts[1] : parts[0]
  return {
    shortName: isValidShortChainName(shortName) ? shortName : currentChainShortName,
    safeAddress: checksumAddress(safeAddress) || '',
  }
}

export const hasPrefixedSafeAddressInUrl = (): boolean => {
  const match = matchPath<SafeRouteSlugs>(history.location.pathname, {
    // Routes that have addresses in URL
    path: [ADDRESSED_ROUTE, LOAD_SPECIFIC_SAFE_ROUTE],
  })
  return !!match?.params?.[SAFE_ADDRESS_SLUG]
}

export const extractShortChainName = (): string => extractPrefixedSafeAddress().shortName
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

export const generatePrefixedAddressRoutes = (params: SafeRouteParams): typeof SAFE_ROUTES =>
  Object.entries(SAFE_ROUTES).reduce<typeof SAFE_ROUTES>(
    (routes, [key, route]) => ({ ...routes, [key]: generateSafeRoute(route, params) }),
    {} as typeof SAFE_ROUTES,
  )
