import { handleActions } from 'redux-actions'

import { AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { ADD_ENTRY } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { ADD_OR_UPDATE_ENTRY } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { LOAD_ADDRESS_BOOK } from 'src/logic/addressBook/store/actions/loadAddressBook'
import { REMOVE_ENTRY } from 'src/logic/addressBook/store/actions/removeAddressBookEntry'
import { UPDATE_ENTRY } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { checksumAddress } from 'src/utils/checksumAddress'
import { getValidAddressBookName } from 'src/logic/addressBook/utils'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

export const buildAddressBook = (storedAddressBook: AddressBookState): AddressBookState => {
  return storedAddressBook.map((addressBookEntry) => {
    const { address, name } = addressBookEntry
    return makeAddressBookEntry({ address: checksumAddress(address), name })
  })
}

export default handleActions(
  {
    [LOAD_ADDRESS_BOOK]: (state, action) => {
      const { addressBook } = action.payload
      return addressBook
    },
    [ADD_ENTRY]: (state, action) => {
      const { entry } = action.payload

      const entryFound = state.find((oldEntry) => oldEntry.address === entry.address)

      if (!entryFound) {
        state.push(entry)
      }
      return state
    },
    [UPDATE_ENTRY]: (state, action) => {
      const { entry } = action.payload
      const entryIndex = state.findIndex((oldEntry) => oldEntry.address === entry.address)
      if (entryIndex >= 0) {
        state[entryIndex] = entry
      }
      return state
    },
    [REMOVE_ENTRY]: (state, action) => {
      const { entryAddress } = action.payload
      const entryIndex = state.findIndex((oldEntry) => oldEntry.address === entryAddress)
      state.splice(entryIndex, 1)
      return state
    },
    [ADD_OR_UPDATE_ENTRY]: (state, action) => {
      const { entry } = action.payload

      // Only updates entries with valid names
      const validName = getValidAddressBookName(entry.name)
      if (!validName) {
        return state
      }

      const entryIndex = state.findIndex((oldEntry) => oldEntry.address === entry.address)

      if (entryIndex >= 0) {
        state[entryIndex] = entry
      } else {
        state.push(entry)
      }
      return state
    },
  },
  [],
)
