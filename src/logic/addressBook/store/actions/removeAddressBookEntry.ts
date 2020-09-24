import { createAction } from 'redux-actions'

export const REMOVE_ENTRY = 'REMOVE_ENTRY'

export const removeAddressBookEntry = createAction(REMOVE_ENTRY, (entryAddress: string) => ({
  entryAddress,
}))
