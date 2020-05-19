import { createAction } from 'redux-actions'

export const ADD_OR_UPDATE_ENTRY = 'ADD_OR_UPDATE_ENTRY'

export const addOrUpdateAddressBookEntry = createAction(ADD_OR_UPDATE_ENTRY, (entryAddress, entry) => ({
  entryAddress,
  entry,
}))
