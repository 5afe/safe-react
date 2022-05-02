import { Action, handleActions } from 'redux-actions'
import uniqWith from 'lodash/uniqWith'

import { AddressBookEntry, AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { ADDRESS_BOOK_ACTIONS } from 'src/logic/addressBook/store/actions'
import { getEntryIndex, hasSameAddressAndChainId, isValidAddressBookName } from 'src/logic/addressBook/utils'
import { textShortener } from 'src/utils/strings'
import { isValidAddress } from 'src/utils/isValidAddress'
import { checksumAddress } from 'src/utils/checksumAddress'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

export const initialAddressBookState: AddressBookState = []

type Payloads = AddressBookEntry | AddressBookState

export const getAddressBookFallbackName = (address: string): string =>
  textShortener({ charsStart: 6, charsEnd: 4 })(address)

export const batchLoadEntries = (state: AddressBookState, action: Action<AddressBookState>): AddressBookState => {
  const newState = [...state]
  // We check that name exist before trimming
  const addressBookEntries = action.payload.map((entry) => ({
    ...entry,
    address: checksumAddress(entry.address) || entry.address,
    name: entry.name ? entry.name.trim() : getAddressBookFallbackName(entry.address),
  }))

  addressBookEntries
    .filter(({ address, name }) => {
      const isValid = isValidAddress(address) && isValidAddressBookName(name)

      if (!isValid) {
        console.warn(`We are unable to import the entry for ${name} (${address}) as it is invalid.`)
      }

      return isValid
    })
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

      const { address, name } = action.payload

      const newState = [...state]
      const addressBookEntry = { ...action.payload, name: name.trim() || getAddressBookFallbackName(address) }
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
    [ADDRESS_BOOK_ACTIONS.SYNC]: (_, action: Action<AddressBookState>): AddressBookState => action.payload,
    [ADDRESS_BOOK_ACTIONS.FIX_EMPTY_NAMES]: (state) => {
      if (state.every(({ name }) => Boolean(name))) {
        return state
      }
      return state.map((entry) => ({
        ...entry,
        name: entry.name || getAddressBookFallbackName(entry.address),
      }))
    },
  },
  initialAddressBookState,
)

export default addressBookReducer
