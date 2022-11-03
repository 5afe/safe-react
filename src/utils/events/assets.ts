import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const ASSETS = {
  CURRENCY_MENU: {
    event: GTM_EVENT.CLICK,
    action: 'Currency menu',
  },
  CHANGE_CURRENCY: {
    event: GTM_EVENT.META,
    action: 'Change currency',
  },
  DIFFERING_TOKENS: {
    event: GTM_EVENT.META,
    action: 'Tokens',
  },
  NFT_AMOUNT: {
    event: GTM_EVENT.META,
    action: 'NFTs',
  },
  SEND: {
    event: GTM_EVENT.CLICK,
    action: 'Send',
  },
  RECEIVE: {
    event: GTM_EVENT.CLICK,
    action: 'Receive',
  },
}

export const ASSETS_CATEGORY = 'assets'
export const ASSETS_EVENTS = addEventCategory(ASSETS, ASSETS_CATEGORY)
