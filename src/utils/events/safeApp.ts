import { GTM_EVENT, trackEvent } from '../googleTagManager'

const SAFE_APP_CATEGORY = 'safe-app'
export const SAFE_APP_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  HOME: {
    event: GTM_EVENT.CLICK,
    category: SAFE_APP_CATEGORY,
    action: 'Open Safe App',
  },
  PIN: {
    event: GTM_EVENT.CLICK,
    category: SAFE_APP_CATEGORY,
    action: 'Pin Safe App',
  },
  UNPIN: {
    event: GTM_EVENT.CLICK,
    category: SAFE_APP_CATEGORY,
    action: 'Unpin Safe App',
  },
}
