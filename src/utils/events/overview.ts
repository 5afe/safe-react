import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const OVERVIEW = {
  HOME: {
    event: GTM_EVENT.CLICK,
    action: 'Go to Welcome page',
  },
  IPHONE_APP_BUTTON: {
    event: GTM_EVENT.CLICK,
    action: 'Download App',
  },
  OPEN_ONBOARD: {
    event: GTM_EVENT.CLICK,
    action: 'Open wallet modal',
  },
  SWITCH_NETWORK: {
    event: GTM_EVENT.CLICK,
    action: 'Switch network',
  },
  SHOW_QR: {
    event: GTM_EVENT.CLICK,
    action: 'Show Safe QR code',
  },
  COPY_ADDRESS: {
    event: GTM_EVENT.CLICK,
    action: 'Copy Safe address',
  },
  OPEN_EXPLORER: {
    event: GTM_EVENT.CLICK,
    action: 'Open Safe on block explorer',
  },
  ADD_SAFE: {
    event: GTM_EVENT.CLICK,
    action: 'Add Safe',
  },
  SIDEBAR: {
    event: GTM_EVENT.CLICK,
    action: 'Sidebar',
  },
  ADDED_SAFES_ON_NETWORK: {
    event: GTM_EVENT.META,
    action: 'Added Safes on', // Safe name is appended in trackEvent
  },
  WHATS_NEW: {
    event: GTM_EVENT.CLICK,
    action: "Open What's New",
  },
  HELP_CENTER: {
    event: GTM_EVENT.CLICK,
    action: 'Open Help Center',
  },
  OPEN_INTERCOM: {
    event: GTM_EVENT.CLICK,
    action: 'Open Intercom',
  },
  NEW_TRANSACTION: {
    event: GTM_EVENT.CLICK,
    action: 'New transaction',
  },
}

export const OVERVIEW_CATEGORY = 'overview'
export const OVERVIEW_EVENTS = addEventCategory(OVERVIEW, OVERVIEW_CATEGORY)
