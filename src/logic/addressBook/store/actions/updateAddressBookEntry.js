// @flow
import { createAction } from 'redux-actions'
import type { AddressBookEntry } from '~/logic/addressBook/model/addressBook'

export const UPDATE_ENTRY = 'UPDATE_ENTRY'

export const updateAddressBookEntry = createAction<string, *, *>(
  UPDATE_ENTRY,
  (entry: AddressBookEntry): AddressBookEntry => ({
    entry,
  }),
)
