import { createBrowserHistory } from 'history'
import { generatePath } from 'react-router-dom'

import { PUBLIC_URL } from 'src/utils/constants'
import { getPrefixedSafeAddressSlug } from './utils/prefixedSafeAddress'

export const history = createBrowserHistory({
  basename: PUBLIC_URL,
})

// Routes independant of safe/network
export const WELCOME_ROUTE = '/welcome'
export const OPEN_ROUTE = '/open'
export const LOAD_ROUTE = '/load'

// Safe specific routes
export const SAFE_ADDRESS_SLUG = 'prefixedSafeAddress'
export const SAFE_ROUTE = `/:${SAFE_ADDRESS_SLUG}`

// Safe section routes, i.e. /:prefixedSafeAddress/settings
const SAFE_SECTION_SLUG = 'safeSection'
export const SAFE_SECTION_ROUTE = `${SAFE_ROUTE}/:${SAFE_SECTION_SLUG}`

// Safe subsection routes, i.e. /:prefixedSafeAddress/settings/advanced
const SAFE_SUBSECTION_SLUG = 'safeSubsection'
export const SAFE_SUBSECTION_ROUTE = `${SAFE_SECTION_ROUTE}/:${SAFE_SUBSECTION_SLUG}`

// URL: gnosis-safe.io/app/:[SAFE_ADDRESS_SLUG]/:[SAFE_SECTION_SLUG]/:[SAFE_SUBSECTION_SLUG]
export type SafeRouteSlugs = {
  [SAFE_ADDRESS_SLUG]: string
  [SAFE_SECTION_SLUG]: string
  [SAFE_SUBSECTION_SLUG]: string
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
export const generateSafeRoute: typeof generatePath = (path, params = {}) =>
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
