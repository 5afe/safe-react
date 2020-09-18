import { createAction } from 'redux-actions'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'

export const ADD_ENTRY = 'ADD_ENTRY'

type addAddressBookEntryOptions = {
  notifyEntryUpdate: boolean
}

export const addAddressBookEntry = createAction(
  ADD_ENTRY,
  (entry: AddressBookEntry, options: addAddressBookEntryOptions) => {
    let notifyEntryUpdate = true
    if (options) {
      notifyEntryUpdate = options.notifyEntryUpdate
    }
    return {
      entry,
      shouldAvoidUpdatesNotifications: !notifyEntryUpdate,
    }
  },
)
