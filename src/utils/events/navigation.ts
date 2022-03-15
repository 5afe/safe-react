import { GTM_EVENT, trackEvent } from '../googleTagManager'
import { addEventCategory } from './utils'

// Tracked alongside pageviews
const NAVIGATION = {
  BALANCE: {
    event: GTM_EVENT.CLICK,
    action: 'Balance',
  },
  COLLECTIBLES: {
    event: GTM_EVENT.CLICK,
    action: 'Collectibles',
  },
  TRANSACTIONS: {
    event: GTM_EVENT.CLICK,
    action: 'Transactions',
  },
  ADDRESS_BOOK: {
    event: GTM_EVENT.CLICK,
    action: 'Address Book',
  },
  SAFE_APP: {
    event: GTM_EVENT.CLICK,
    action: 'Safe Apps',
  },
  SETTINGS: {
    event: GTM_EVENT.CLICK,
    action: 'Settings',
  },
}

const NAVIGATION_CATEGORY = 'navigation'
export const NAVIGATION_EVENTS = addEventCategory(NAVIGATION, NAVIGATION_CATEGORY)

export const NAVIGATION_SETTINGS_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  ADVANCED: {
    ...NAVIGATION_EVENTS.SETTINGS,
    label: 'Advanced',
  },
  APPEARANCE: {
    ...NAVIGATION_EVENTS.SETTINGS,
    label: 'Appearance',
  },
  DETAILS: {
    ...NAVIGATION_EVENTS.SETTINGS,
    label: 'Details',
  },
  OWNERS: {
    ...NAVIGATION_EVENTS.SETTINGS,
    label: 'Owners',
  },
  THRESHOLD: {
    ...NAVIGATION_EVENTS.SETTINGS,
    label: 'Threshold',
  },
}
