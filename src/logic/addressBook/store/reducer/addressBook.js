// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import type { AddressBookEntry } from '~/logic/addressBook/model/addressBook'
import { ADD_ENTRY } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import { UPDATE_ENTRY } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { REMOVE_ENTRY } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { ADD_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/addAddressBook'
import { LOAD_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/loadAddressBook'
import { sameAddress } from '~/logic/wallets/ethAddresses'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'


export type State = Map<string, Map<AddressBookEntry>>

export default handleActions<State, *>(
  {
    [LOAD_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook } = action.payload
      return state.set('addressBook', addressBook)
    },
    [ADD_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook, safeAddress } = action.payload
      return state.setIn(['addressBook', safeAddress], addressBook)
    },
    [ADD_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry } = action.payload

      // Adds the entry to all the safes
      const newState = state.withMutations((map) => {
        map
          .get('addressBook')
          .keySeq()
          .forEach((safeAddress) => {
            const currentList = state.getIn(['addressBook', safeAddress])
            currentList.push(entry)
            map.setIn(['addressBook', safeAddress], currentList)
          })
      })
      return newState
    },
    [UPDATE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry } = action.payload

      // Updates the entry from all the safes
      const newState = state.withMutations((map) => {
        map
          .get('addressBook')
          .keySeq()
          .forEach((safeAddress) => {
            const entriesList = state.getIn(['addressBook', safeAddress])
            const entryIndex = entriesList.findIndex((entryItem) => sameAddress(entryItem.address, entry.address))
            entriesList[entryIndex] = entry
            map.setIn(['addressBook', safeAddress], entriesList)
          })
      })

      return newState
    },
    [REMOVE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entryAddress } = action.payload
      // Removes the entry from all the safes
      const newState = state.withMutations((map) => {
        map
          .get('addressBook')
          .keySeq()
          .forEach((safeAddress) => {
            const entriesList = state.getIn(['addressBook', safeAddress])
            const entryIndex = entriesList.findIndex((entry) => sameAddress(entry.address, entryAddress))
            entriesList.splice(entryIndex, 1)
            const currentList = state.getIn(['addressBook', safeAddress])
            map.setIn(['addressBook', safeAddress], currentList)
          })
      })
      return newState
    },
  },
  Map(),
)
