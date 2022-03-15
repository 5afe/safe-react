import { GTM_EVENT, trackEvent } from '../googleTagManager'

const SETTINGS_CATEGORY = 'safe-settings'
export const SAFE_SETTINGS: Record<string, Parameters<typeof trackEvent>[0]> = {
  PREFIXES: {
    event: GTM_EVENT.CLICK,
    category: SETTINGS_CATEGORY,
    action: 'EIP-3770 prefixes',
  },
}
