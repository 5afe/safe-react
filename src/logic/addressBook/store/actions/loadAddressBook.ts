import { createAction } from 'redux-actions'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

export const LOAD_ADDRESS_BOOK = 'LOAD_ADDRESS_BOOK'

export const loadAddressBook = createAction(LOAD_ADDRESS_BOOK, (addressBook: AddressBookState) => ({
  addressBook,
}))
