// @flow
import { createAction } from 'redux-actions'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'

export const ADD_ENTRY = 'ADD_ENTRY'


export const addAddressBookEntry = createAction<string, *, *>(ADD_ENTRY, (entry: AddressBookEntryType): AddressBookEntryType => ({
  entry,
}))
