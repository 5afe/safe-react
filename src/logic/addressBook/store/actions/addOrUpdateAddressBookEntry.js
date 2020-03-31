// @flow
import { createAction } from 'redux-actions'

import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'

export const ADD_OR_UPDATE_ENTRY = 'ADD_OR_UPDATE_ENTRY'

export const addOrUpdateAddressBookEntry = createAction<string, *, *>(
  ADD_OR_UPDATE_ENTRY,
  (entryAddress: string, entry: AddressBookEntryType): AddressBookEntryType => ({
    entryAddress,
    entry,
  }),
)
