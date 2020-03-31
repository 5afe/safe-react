/* eslint-disable import/named */
// @flow
import { List, Map } from 'immutable'
import { useSelector } from 'react-redux'
import { Selector, createSelector } from 'reselect'

import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import type { GlobalState } from '~/store'

export const addressBookMapSelector = (state: GlobalState): Map<string, AddressBook> =>
  state[ADDRESS_BOOK_REDUCER_ID].get('addressBook')

export const getAddressBook: Selector<GlobalState, AddressBook> = createSelector(
  addressBookMapSelector,
  safeParamAddressFromStateSelector,
  (addressBook: AddressBook, safeAddress: string) => {
    let result = Map([])
    if (addressBook) {
      result = addressBook.get(safeAddress)
    }
    return result
  },
)

export const getAddressBookListSelector: Selector<GlobalState, {}, List<AddressBook>> = createSelector(
  addressBookMapSelector,
  safeParamAddressFromStateSelector,
  (addressBook: Map<string, AddressBook>, safeAddress: string): List<AddressBook> => {
    let result = List([])
    if (addressBook) {
      result = List(addressBook.get(safeAddress))
    }
    return result
  },
)

export const getNameFromAddressBook = (userAddress: string): string | null => {
  if (!userAddress) {
    return null
  }
  const addressBook = useSelector(getAddressBook)
  const result = addressBook.filter((addressBookItem) => addressBookItem.address === userAddress)
  if (result.size > 0) {
    return result.get(0).name
  }
  return null
}
