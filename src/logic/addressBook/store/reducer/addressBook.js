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
      const { addressBook } = action.payload

      return state.set('addressBook', addressBook)
    },
    [ADD_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry } = action.payload

      const currentList = state.get('addressBook')
      currentList.push(entry)
      return state.set('addressBook', currentList)
    },
    [UPDATE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry, entryIndex } = action.payload
      return state.setIn(['addressBook', entryIndex], entry)
    },
    [REMOVE_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entryIndex } = action.payload
      return state.deleteIn(['addressBook', entryIndex])
    },
  },
  Map(),
)
