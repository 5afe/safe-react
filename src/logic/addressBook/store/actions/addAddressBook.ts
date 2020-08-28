import { createAction } from 'redux-actions'

export const ADD_ADDRESS_BOOK = 'ADD_ADDRESS_BOOK'

export const addAddressBook = createAction(ADD_ADDRESS_BOOK, (addressBook, safeAddress) => ({
  addressBook,
  safeAddress,
}))
