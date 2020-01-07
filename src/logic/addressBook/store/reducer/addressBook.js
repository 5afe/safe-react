// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import type { AddressBookEntry } from '~/logic/addressBook/model/addressBook'
import { ADD_ENTRY } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import { UPDATE_ENTRY } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { REMOVE_ENTRY } from '~/logic/addressBook/store/actions/removeAddressBookEntry'
import { ADD_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/addAddressBook'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'


export type State = Map<string, Map<AddressBookEntry>>

export default handleActions<State, *>(
  {
    [ADD_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook, safeAddress } = action.payload
      return state.setIn(['addressBook', safeAddress], addressBook)
    },
    [ADD_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry, safeAddress } = action.payload

      const currentList = state.getIn(['addressBook', safeAddress])
      currentList.push(entry)
      return state.setIn(['addressBook', safeAddress], currentList)
    },
    [UPDATE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry, entryIndex, safeAddress } = action.payload
      const entriesList = state.getIn(['addressBook', safeAddress])
      entriesList[entryIndex] = entry
      return state.setIn(['addressBook', safeAddress], entriesList)
    },
    [REMOVE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entryIndex, safeAddress } = action.payload
      const entriesList = state.getIn(['addressBook', safeAddress])
      entriesList.splice(entryIndex, 1)
      return state.setIn(['addressBook', safeAddress], entriesList)
    },
  },
  Map(),
)
