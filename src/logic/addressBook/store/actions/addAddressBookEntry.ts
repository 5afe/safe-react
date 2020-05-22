import { createAction } from 'redux-actions'

export const ADD_ENTRY = 'ADD_ENTRY'

export const addAddressBookEntry = createAction(ADD_ENTRY, (entry) => ({
  entry,
}))
