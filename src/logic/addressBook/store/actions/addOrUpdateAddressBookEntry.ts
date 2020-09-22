import { createAction } from 'redux-actions'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'

export const ADD_OR_UPDATE_ENTRY = 'ADD_OR_UPDATE_ENTRY'

export const addOrUpdateAddressBookEntry = createAction(ADD_OR_UPDATE_ENTRY, (entry: AddressBookEntry) => ({
  entry,
}))
