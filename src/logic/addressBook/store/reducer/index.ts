import { Action, handleActions } from 'redux-actions'
import uniqWith from 'lodash/uniqWith'

import { AddressBookEntry, AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { ADDRESS_BOOK_ACTIONS } from 'src/logic/addressBook/store/actions'
import { getEntryIndex, hasSameAddressAndChainId, isValidAddressBookName } from 'src/logic/addressBook/utils'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

export const initialAddressBookState: AddressBookState = []

type Payloads = AddressBookEntry | AddressBookState

export const batchLoadEntries = (state: AddressBookState, action: Action<AddressBookState>): AddressBookState => {
  const newState = [...state]
  // We check that name exist before trimming to avoid issues during migration to unified domain
  const addressBookEntries = action.payload.map((entry) => ({ ...entry, name: entry.name ? entry.name.trim() : '' }))
  addressBookEntries
    // exclude those entries with invalid name
    .filter(({ name }) => isValidAddressBookName(name))
    .forEach((addressBookEntry) => {
      const entryIndex = getEntryIndex(newState, addressBookEntry)

      if (entryIndex >= 0) {
        // update
        newState[entryIndex] = addressBookEntry
      } else {
        // add
        newState.push(addressBookEntry)
      }
    })

  // filter out potential duplicates in the store
  return uniqWith(newState, hasSameAddressAndChainId)
}

const addressBookReducer = handleActions<AddressBookState, Payloads>(
  {
    [ADDRESS_BOOK_ACTIONS.ADD_OR_UPDATE]: (state, action: Action<AddressBookEntry>) => {
      if (!action.payload.address) return state

      const newState = [...state]
      const addressBookEntry = { ...action.payload, name: action.payload.name.trim() }
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
    [ADDRESS_BOOK_ACTIONS.SAFE_LOAD]: batchLoadEntries,
    [ADDRESS_BOOK_ACTIONS.IMPORT]: batchLoadEntries,
    [ADDRESS_BOOK_ACTIONS.MIGRATE]: batchLoadEntries,
    [ADDRESS_BOOK_ACTIONS.SYNC]: (_, action: Action<AddressBookState>): AddressBookState => action.payload,
  },
  initialAddressBookState,
)

export default addressBookReducer
