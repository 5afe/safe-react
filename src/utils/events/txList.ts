import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const TX_LIST = {
  QUEUED_TXS: {
    event: GTM_EVENT.META,
    action: 'Queued transactions',
  },
  ADDRESS_BOOK: {
    event: GTM_EVENT.CLICK,
    action: 'Update address book',
  },
  COPY_DEEPLINK: {
    event: GTM_EVENT.CLICK,
    action: 'Copy deeplink',
  },
  CONFIRM: {
    event: GTM_EVENT.CLICK,
    action: 'Confirm transaction',
  },
  EXECUTE: {
    event: GTM_EVENT.CLICK,
    action: 'Execute transaction',
  },
  REJECT: {
    event: GTM_EVENT.CLICK,
    action: 'Reject transaction',
  },
  FILTER: {
    event: GTM_EVENT.CLICK,
    action: 'Filter transactions',
  },
  BATCH_EXECUTE: {
    event: GTM_EVENT.CLICK,
    action: 'Batch Execute',
  },
}

const TX_LIST_CATEGORY = 'tx-list'
export const TX_LIST_EVENTS = addEventCategory(TX_LIST, TX_LIST_CATEGORY)
