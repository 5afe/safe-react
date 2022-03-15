import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const WALLET = {
  CONNECT: {
    event: GTM_EVENT.META,
    action: 'Connect wallet',
  },
}

const WALLET_CATEGORY = 'wallet'
export const WALLET_EVENTS = addEventCategory(WALLET, WALLET_CATEGORY)
