// @flow
import { List, Map } from 'immutable'
import { createSelector, Selector } from 'reselect'
import { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import type { GlobalState } from '~/store'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'


export const addressBookMapSelector = (state: GlobalState): Map<string, AddressBook> => state[ADDRESS_BOOK_REDUCER_ID].get('addressBook') || List([])

export const getAddressBook: Selector<GlobalState, AddressBook> = createSelector(
  addressBookMapSelector,
  safeParamAddressFromStateSelector,
  (addressBook: AddressBook, safeAddress: string) => addressBook.get(safeAddress) || List([]),
)
