import { Action, handleActions } from 'redux-actions'

import { AddressBookEntry, AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { ADDRESS_BOOK_ACTIONS } from 'src/logic/addressBook/store/actions'
import { getEntryIndex, isValidAddressBookName } from 'src/logic/addressBook/utils'
import { AppReduxState } from 'src/store'
import { checksumAddress } from 'src/utils/checksumAddress'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

type Payloads = AddressBookEntry | AddressBookState

export default handleActions<AppReduxState['addressBook'], Payloads>(
  {
    [ADDRESS_BOOK_ACTIONS.ADD_OR_UPDATE]: (state, action: Action<AddressBookEntry>) => {
      const newState = [...state]
      const { address, ...rest } = action.payload

      if (!isValidAddressBookName(rest.name)) {
        // prevent adding an invalid name
        return newState
      }

      // always checksum the address before storing it
      const addressBookEntry = { address: checksumAddress(address), ...rest }

      const entryIndex = getEntryIndex(newState, addressBookEntry)

      // update
      if (entryIndex >= 0) {
        newState[entryIndex] = addressBookEntry
        return newState
      }

      // add
      return [...newState, addressBookEntry]
    },
    [ADDRESS_BOOK_ACTIONS.REMOVE]: (state, action: Action<AddressBookEntry>) => {
      const newState = [...state]
      const addressBookEntry = action.payload

      const entryIndex = getEntryIndex(newState, addressBookEntry)

      if (entryIndex >= 0) {
        newState.splice(entryIndex, 1)
        return newState
      }

      return newState
    },
    [ADDRESS_BOOK_ACTIONS.SAFE_LOAD]: (state, action: Action<AddressBookState>) => {
      const newState = [...state]
      const addressBookEntries = action.payload

      addressBookEntries
        // exclude those entries with invalid name
        .filter(({ name }) => isValidAddressBookName(name))
        .forEach((addressBookEntry) => {
          const { address, ...rest } = addressBookEntry

          // always checksum the address before storing it
          const newAddressBookEntry = { address: checksumAddress(address), ...rest }
          const entryIndex = getEntryIndex(newState, newAddressBookEntry)

          if (entryIndex >= 0) {
            // update
            newState[entryIndex] = newAddressBookEntry
          } else {
            // add
            newState.push(newAddressBookEntry)
          }
        })

      return newState
    },
    [ADDRESS_BOOK_ACTIONS.IMPORT](...args) {
      // same functionality, but `IMPORT` will trigger notifications when called
      return this[ADDRESS_BOOK_ACTIONS.SAFE_LOAD](...args)
    },
  },
  [],
)
