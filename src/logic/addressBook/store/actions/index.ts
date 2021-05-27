import { createAction } from 'redux-actions'

import { AddressBookEntry, AddressBookState } from 'src/logic/addressBook/model/addressBook'

// following the suggested naming convention at
// https://redux.js.org/style-guide/style-guide#write-action-types-as-domaineventname
export enum ADDRESS_BOOK_ACTIONS {
  ADD_OR_UPDATE = 'addressBook/addOrUpdate',
  REMOVE = 'addressBook/remove',
  IMPORT = 'addressBook/import',
  SAFE_LOAD = 'addressBook/safeLoad',
}

export const addressBookAddOrUpdate = createAction<AddressBookEntry>(ADDRESS_BOOK_ACTIONS.ADD_OR_UPDATE)
export const addressBookRemove = createAction<AddressBookEntry>(ADDRESS_BOOK_ACTIONS.REMOVE)
export const addressBookSafeLoad = createAction<AddressBookState>(ADDRESS_BOOK_ACTIONS.SAFE_LOAD)
export const addressBookImport = createAction<AddressBookState>(ADDRESS_BOOK_ACTIONS.IMPORT)
