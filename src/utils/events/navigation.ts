import { GTM_EVENT, trackEvent } from '../googleTagManager'

// Legacy GA tracked all navigation, as well as pageviews
const NAVIGATION_CATEGORY = 'safe-navigation'
export const SAFE_NAVIGATION: Record<string, Parameters<typeof trackEvent>[0]> = {
  BALANCE: {
    event: GTM_EVENT.CLICK,
    category: NAVIGATION_CATEGORY,
    action: 'Balance',
  },
  COLLECTIBLES: {
    event: GTM_EVENT.CLICK,
    category: NAVIGATION_CATEGORY,
    action: 'Collectibles',
  },
  TRANSACTIONS: {
    event: GTM_EVENT.CLICK,
    category: NAVIGATION_CATEGORY,
    action: 'Transactions',
  },
  ADDRESS_BOOK: {
    event: GTM_EVENT.CLICK,
    category: NAVIGATION_CATEGORY,
    action: 'Address Book',
  },
  SAFE_APP: {
    event: GTM_EVENT.CLICK,
    category: NAVIGATION_CATEGORY,
    action: 'Safe Apps',
  },
  SETTINGS: {
    event: GTM_EVENT.CLICK,
    category: NAVIGATION_CATEGORY,
    action: 'Settings',
  },
}

export const SAFE_NAVIGATION_SETTINGS: Record<string, Parameters<typeof trackEvent>[0]> = {
  ADVANCED: {
    ...SAFE_NAVIGATION.SETTINGS,
    label: 'Advanced',
  },
  APPEARANCE: {
    ...SAFE_NAVIGATION.SETTINGS,
    label: 'Appearance',
  },
  DETAILS: {
    ...SAFE_NAVIGATION.SETTINGS,
    label: 'Details',
  },
  OWNERS: {
    ...SAFE_NAVIGATION.SETTINGS,
    label: 'Owners',
  },
  THRESHOLD: {
    ...SAFE_NAVIGATION.SETTINGS,
    label: 'Threshold',
  },
}
