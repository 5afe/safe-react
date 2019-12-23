// @flow
import { List } from 'immutable'
import { createSelector, Selector } from 'reselect'
import type { Provider } from '~/logic/wallets/store/model/provider'
import { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import type { GlobalState } from '~/store'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'

export const getAddressBook = (state: any): Provider => List(state[ADDRESS_BOOK_REDUCER_ID].get('addressBook')) || List([])

export const getAddressBookListSelector: Selector<GlobalState, AddressBook> = createSelector(
  getAddressBook,
  (addressBook: AddressBook) => (addressBook ? List(addressBook) : List([])),
)
