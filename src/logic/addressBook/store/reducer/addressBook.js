// @flow
import { List, Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import type { AddressBook, AddressBookEntry, AddressBookProps } from '~/logic/addressBook/model/addressBook'
import { ADD_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/addAddressBook'
import { ADD_ENTRY } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import { LOAD_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/loadAddressBook'
import { REMOVE_ENTRY } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { UPDATE_ENTRY } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { getAddressesListFromAdbk } from '~/logic/addressBook/utils'
import { sameAddress } from '~/logic/wallets/ethAddresses'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

export type State = Map<string, Map<string, AddressBookEntry>>

export const buildAddressBook = (storedAdbk: AddressBook): AddressBookProps => {
  let addressBookBuilt = Map([])
  Object.entries(storedAdbk).forEach((adbkProps: Array<string, AddressBookEntry[]>) => {
    const safeAddress = adbkProps[0]
    const adbkSafeEntries = List(adbkProps[1])
    addressBookBuilt = addressBookBuilt.set(safeAddress, adbkSafeEntries)
  })
  return addressBookBuilt
}

export default handleActions<State, *>(
  {
    [LOAD_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook } = action.payload
      return state.set('addressBook', addressBook)
    },
    [ADD_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook, safeAddress } = action.payload
      // Adds the address book if it does not exists
      const found = state.getIn(['addressBook', safeAddress])
      if (!found) {
        return state.setIn(['addressBook', safeAddress], addressBook)
      }
      return state
    },
    [ADD_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry } = action.payload

      // Adds the entry to all the safes (if it does not already exists)
      const newState = state.withMutations(map => {
        const adbkMap = map.get('addressBook')

        if (adbkMap) {
          adbkMap.keySeq().forEach(safeAddress => {
            const safeAddressBook = state.getIn(['addressBook', safeAddress])

            if (safeAddressBook) {
              const adbkAddressList = getAddressesListFromAdbk(safeAddressBook)
              const found = adbkAddressList.includes(entry.address)
              if (!found) {
                const updatedSafeAdbkList = safeAddressBook.push(entry)
                map.setIn(['addressBook', safeAddress], updatedSafeAdbkList)
              }
            }
          })
        }
      })
      return newState
    },
    [UPDATE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry } = action.payload

      // Updates the entry from all the safes
      const newState = state.withMutations(map => {
        map
          .get('addressBook')
          .keySeq()
          .forEach(safeAddress => {
            const entriesList: List<AddressBookEntry> = state.getIn(['addressBook', safeAddress])
            const entryIndex = entriesList.findIndex(entryItem => sameAddress(entryItem.address, entry.address))
            const updatedEntriesList = entriesList.set(entryIndex, entry)
            map.setIn(['addressBook', safeAddress], updatedEntriesList)
          })
      })

      return newState
    },
    [REMOVE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entryAddress } = action.payload
      // Removes the entry from all the safes
      const newState = state.withMutations(map => {
        map
          .get('addressBook')
          .keySeq()
          .forEach(safeAddress => {
            const entriesList = state.getIn(['addressBook', safeAddress])
            const entryIndex = entriesList.findIndex(entry => sameAddress(entry.address, entryAddress))
            const updatedEntriesList = entriesList.remove(entryIndex)
            map.setIn(['addressBook', safeAddress], updatedEntriesList)
          })
      })
      return newState
    },
  },
  Map(),
)
