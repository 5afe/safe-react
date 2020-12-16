import { createAction } from 'redux-actions'
import { RemoveEntryPayload } from 'src/logic/addressBook/store/reducer/addressBook'

export const REMOVE_ENTRY = 'REMOVE_ENTRY'

export const removeAddressBookEntry = createAction<RemoveEntryPayload, string>(
  REMOVE_ENTRY,
  (entryAddress: string) => ({
    entryAddress,
  }),
)
