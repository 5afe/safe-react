import { trackEvent, GTM_EVENT } from 'src/utils/googleTagManager'

export const SAFE_OVERVIEW_CATEGORY = 'safe-overview'
export const SAFE_OVERVIEW_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  HOME: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Go to Welcome page',
  },
  OPEN_CURRENCY_MENU: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open currency menu',
  },
  CHANGE_CURRENCY: {
    event: GTM_EVENT.META,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Change currency',
  },
  OPEN_INTERCOM: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open Intercom',
  },
  HELP_CENTER: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open Help Center',
  },
  SHOW_QR: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Show Safe QR code',
  },
  COPY_ADDRESS: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Copy Safe address',
  },
  OPEN_EXPLORER: {
    event: GTM_EVENT.CLICK,
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open Safe on block explorer',
  },
}
