// @flow
import { createAction } from 'redux-actions'
import type { AddressBookEntry } from '~/logic/addressBook/model/addressBook'

export const UPDATE_ENTRY_NAME = 'UPDATE_ENTRY_NAME'


export const updateAddressBookEntryName = createAction<string, *, *>(UPDATE_ENTRY_NAME, (entryName: string, entryAddress: string, safeAddress: string): AddressBookEntry => ({
  entryName,
  entryAddress,
  safeAddress,
}))
