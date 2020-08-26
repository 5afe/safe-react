import { List, Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { AddressBookEntry, AddressBookEntryProps, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { ADD_ADDRESS_BOOK } from 'src/logic/addressBook/store/actions/addAddressBook'
import { ADD_ENTRY } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { ADD_OR_UPDATE_ENTRY } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { LOAD_ADDRESS_BOOK } from 'src/logic/addressBook/store/actions/loadAddressBook'
import { REMOVE_ENTRY } from 'src/logic/addressBook/store/actions/removeAddressBookEntry'
import { UPDATE_ENTRY } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { getAddressesListFromAdbk } from 'src/logic/addressBook/utils'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { checksumAddress } from 'src/utils/checksumAddress'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

export type AddressBookCollection = List<AddressBookEntry>
export type AddressBookState = Map<string, AddressBookCollection>

export const buildAddressBook = (storedAdbk: Array<AddressBookEntryProps>): AddressBookState => {
  let addressBookBuilt: Map<string, AddressBookCollection> = Map([])

  Object.entries(storedAdbk).forEach((adbkProps: unknown) => {
    const safeAddress = checksumAddress(adbkProps[0])
    const adbkRecords = adbkProps[1].map(makeAddressBookEntry)
    const adbkSafeEntries: AddressBookCollection = List(adbkRecords)
    addressBookBuilt = addressBookBuilt.set(safeAddress, adbkSafeEntries)
  })

  return addressBookBuilt
}

export default handleActions(
  {
    [LOAD_ADDRESS_BOOK]: (state, action) => {
      const { addressBook } = action.payload
      return addressBook
    },
    [ADD_ADDRESS_BOOK]: (state, action) => {
      const { addressBook, safeAddress } = action.payload
      // Adds the address book if it does not exists
      const found = state.get(safeAddress)
      if (!found) {
        return state.set(safeAddress, addressBook)
      }
      return state
    },
    [ADD_ENTRY]: (state, action) => {
      const { entry } = action.payload

      // Adds the entry to all the safes (if it does not already exists)
      return state.withMutations((map) => {
        if (map) {
          map.keySeq().forEach((safeAddress) => {
            const safeAddressBook = state.get(safeAddress)

            if (safeAddressBook) {
              const adbkAddressList = getAddressesListFromAdbk(safeAddressBook)
              const found = adbkAddressList.includes(entry.address)
              if (!found) {
                const updatedSafeAdbkList = safeAddressBook.push(entry)
                map.set(safeAddress, updatedSafeAdbkList)
              }
            }
          })
        }
      })
    },
    [UPDATE_ENTRY]: (state, action) => {
      const { entry } = action.payload

      // Updates the entry from all the safes
      return state.withMutations((map) => {
        map.keySeq().forEach((safeAddress) => {
          const entriesList = state.get(safeAddress)
          const entryIndex = entriesList.findIndex((entryItem) => sameAddress(entryItem.address, entry.address))
          const updatedEntriesList = entriesList.set(entryIndex, entry)
          map.set(safeAddress, updatedEntriesList)
        })
      })
    },
    [REMOVE_ENTRY]: (state, action) => {
      const { entryAddress } = action.payload
      // Removes the entry from all the safes
      return state.withMutations((map) => {
        map.keySeq().forEach((safeAddress) => {
          const entriesList = state.get(safeAddress)
          const entryIndex = entriesList.findIndex((entry) => sameAddress(entry.address, entryAddress))
          const updatedEntriesList = entriesList.remove(entryIndex)
          map.set(safeAddress, updatedEntriesList)
        })
      })
    },
    [ADD_OR_UPDATE_ENTRY]: (state, action) => {
      const { entry, entryAddress } = action.payload

      // Adds or Updates the entry to all the safes
      return state.withMutations((map) => {
        if (map) {
          map.keySeq().forEach((safeAddress) => {
            const safeAddressBook = state.get(safeAddress)
            const entryIndex = safeAddressBook.findIndex((entryItem) => sameAddress(entryItem.address, entryAddress))

            if (entryIndex !== -1) {
              const updatedEntriesList = safeAddressBook.update(entryIndex, (currentEntry) => currentEntry.merge(entry))
              map.set(safeAddress, updatedEntriesList)
            } else {
              const updatedSafeAdbkList = safeAddressBook.push(makeAddressBookEntry(entry))
              map.set(safeAddress, updatedSafeAdbkList)
            }
          })
        }
      })
    },
  },
  Map({}),
)
