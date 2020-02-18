// @flow
import { createAction } from 'redux-actions'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'

export const LOAD_ADDRESS_BOOK = 'LOAD_ADDRESS_BOOK'

export const loadAddressBook = createAction<string, *, *>(LOAD_ADDRESS_BOOK, (addressBook: AddressBook) => ({
  addressBook,
}))
