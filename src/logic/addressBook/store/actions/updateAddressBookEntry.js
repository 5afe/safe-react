// @flow
import { createAction } from 'redux-actions'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'

export const UPDATE_ENTRY = 'UPDATE_ENTRY'


export const updateAddressBookEntry = createAction<string, *, *>(UPDATE_ENTRY, (entry: AddressBookEntryType, entryIndex: number): AddressBookEntryType => ({
  entry,
  entryIndex,
}))
