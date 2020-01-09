// @flow
import { createAction } from 'redux-actions'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'

export const ADD_ADDRESS_BOOK = 'ADD_ADDRESS_BOOK'

export const addAddressBook = createAction<string, *, *>(
  ADD_ADDRESS_BOOK,
  (addressBook: AddressBook, safeAddress: string) => ({
    addressBook,
    safeAddress,
  }),
)
