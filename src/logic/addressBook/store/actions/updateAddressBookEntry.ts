import { createAction } from 'redux-actions'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'

export const UPDATE_ENTRY = 'UPDATE_ENTRY'

export const updateAddressBookEntry = createAction(UPDATE_ENTRY, (entry: AddressBookEntry) => ({
  entry,
}))
