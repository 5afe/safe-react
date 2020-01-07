// @flow
import { createAction } from 'redux-actions'

export const REMOVE_ENTRY = 'REMOVE_ENTRY'


export const removeAddressBookEntry = createAction<string, *, *>(REMOVE_ENTRY, (entryIndex: number, safeAddress: string): void => ({
  entryIndex,
  safeAddress,
}))
