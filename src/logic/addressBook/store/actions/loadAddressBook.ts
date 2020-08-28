import { createAction } from 'redux-actions'

export const LOAD_ADDRESS_BOOK = 'LOAD_ADDRESS_BOOK'

export const loadAddressBook = createAction(LOAD_ADDRESS_BOOK, (addressBook) => ({
  addressBook,
}))
