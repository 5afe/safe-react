// @flow
import { createAction } from 'redux-actions'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'

export const UPDATE_ADDRESS_BOOK = 'UPDATE_ADDRESS_BOOK'

export const updateAddressBook = createAction<string, *, *>(UPDATE_ADDRESS_BOOK, (addressBook: AddressBook) => ({ addressBook }))
