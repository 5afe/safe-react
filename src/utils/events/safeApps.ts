import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const SAFE_APPS = {
  OPEN_APP: {
    event: GTM_EVENT.CLICK,
    action: 'Open Safe App',
  },
  PIN: {
    event: GTM_EVENT.CLICK,
    action: 'Pin Safe App',
  },
  UNPIN: {
    event: GTM_EVENT.CLICK,
    action: 'Unpin Safe App',
  },
  SEARCH: {
    event: GTM_EVENT.META,
    action: 'Search for Safe App',
  },
  ADD_CUSTOM_APP: {
    event: GTM_EVENT.META,
    action: 'Add custom Safe App',
  },
  TRANSACTION_CONFIRMED: {
    event: GTM_EVENT.META,
    action: 'Transaction Confirmed',
  },
  TRANSACTION_REJECTED: {
    event: GTM_EVENT.META,
    action: 'Transaction Rejected',
  },
  LEGACY_API_CALL: {
    event: GTM_EVENT.META,
    action: 'Legacy API call',
  },
  SHARED_APP_LANDING: {
    event: GTM_EVENT.META,
    action: 'Shared App landing page visited',
  },
  SHARED_APP_CHAIN_ID: {
    event: GTM_EVENT.META,
    action: 'Shared App chainId',
  },
  SHARED_APP_OPEN_DEMO: {
    event: GTM_EVENT.META,
    action: 'Open demo safe from shared app',
  },
  SHARED_APP_OPEN_AFTER_SAFE_CREATION: {
    event: GTM_EVENT.META,
    action: 'Open shared app after Safe creation',
  },
}

const SAFE_APPS_CATEGORY = 'safe-apps'
export const SAFE_APPS_EVENTS = addEventCategory(SAFE_APPS, SAFE_APPS_CATEGORY)
