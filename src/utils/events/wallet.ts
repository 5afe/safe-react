import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const WALLET = {
  CONNECT: {
    event: GTM_EVENT.META,
    action: 'Connect wallet',
  },
  OFF_CHAIN_SIGNATURE: {
    event: GTM_EVENT.META,
    action: 'Off-chain signature',
  },
  ON_CHAIN_INTERACTION: {
    event: GTM_EVENT.META,
    action: 'On-chain interaction',
  },
}

const WALLET_CATEGORY = 'wallet'
export const WALLET_EVENTS = addEventCategory(WALLET, WALLET_CATEGORY)
