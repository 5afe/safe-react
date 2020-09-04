import { createAction } from 'redux-actions'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'

export const ADD_ENTRY = 'ADD_ENTRY'

export const addAddressBookEntry = createAction(ADD_ENTRY, (entry: AddressBookEntry, isOwner?: boolean) => ({
  entry,
  isOwner,
}))
