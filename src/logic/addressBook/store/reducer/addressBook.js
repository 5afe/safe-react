// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import type { Cookie } from '~/logic/cookies/model/cookie'
import { UPDATE_ADDRESS_BOOK } from '~/logic/addressBook/store/actions/updateAddressBook'

export const ADDRESS_BOOK_REDUCER_ID = 'addressBook'

export type State = Map<string, Map<string, Cookie>>

export default handleActions<State, *>(
  {
    [UPDATE_ADDRESS_BOOK]: (state: State, action: ActionType<Function>): State => {
      const { addressBook } = action.payload

      return state.set('addressBook', addressBook)
    },
  },
  Map(),
)
