// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { UPDATE_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/updateAddressBook'
import { ADD_ENTRY } from '~/logic/addressBook/store/actions/addAddressBookEntry'
import type { AddressBookEntryType } from '~/logic/addressBook/model/addressBook'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'


export type State = Map<string, Map<AddressBookEntryType>>

export default handleActions<State, *>(
  {
    [UPDATE_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook } = action.payload

      return state.set('addressBook', addressBook)
    },
    [ADD_ENTRY]: (state: State, action: ActionType<Function>): State => {
      const { entry } = action.payload

      const currentList = state.get('addressBook')
      currentList.push(entry)
      const newState = state.set('addressBook', currentList)
      return newState
    },
  },
  Map(),
)
