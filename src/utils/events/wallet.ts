import { GTM_EVENT, trackEvent } from '../googleTagManager'

const WALLET_CATEGORY = 'wallet'
export const WALLET_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  CONNECT: {
    event: GTM_EVENT.META,
    category: WALLET_CATEGORY,
    action: 'Connect wallet',
  },
}
