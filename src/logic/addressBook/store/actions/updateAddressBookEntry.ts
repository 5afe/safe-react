import { createAction } from 'redux-actions'

export const UPDATE_ENTRY = 'UPDATE_ENTRY'

export const updateAddressBookEntry = createAction(UPDATE_ENTRY, (entry) => ({
  entry,
}))
