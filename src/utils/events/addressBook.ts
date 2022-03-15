import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const ADDRESS_BOOK = {
  EXPORT: {
    event: GTM_EVENT.CLICK,
    action: 'Export',
  },
  DOWNLOAD_BUTTON: {
    event: GTM_EVENT.CLICK,
    action: 'Download address book',
  },
  IMPORT: {
    event: GTM_EVENT.CLICK,
    action: 'Import',
  },
  IMPORT_BUTTON: {
    event: GTM_EVENT.CLICK,
    action: 'Import address book',
  },
  CREATE_ENTRY: {
    event: GTM_EVENT.CLICK,
    action: 'Create entry',
  },
  EDIT_ENTRY: {
    event: GTM_EVENT.CLICK,
    action: 'Edit entry',
  },
  DELETE_ENTRY: {
    event: GTM_EVENT.CLICK,
    action: 'Delete entry',
  },
  SEND: {
    event: GTM_EVENT.CLICK,
    action: 'Send to contact',
  },
}

const ADDRESS_BOOK_CATEGORY = 'address-book'
export const ADDRESS_BOOK_EVENTS = addEventCategory(ADDRESS_BOOK, ADDRESS_BOOK_CATEGORY)
