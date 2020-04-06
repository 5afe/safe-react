/* eslint-disable import/named */
// 
import { List, Map } from 'immutable'
import { useSelector } from 'react-redux'
import { Selector, createSelector } from 'reselect'

import { ADDRESS_BOOK_REDUCER_ID } from '~/logic/addressBook/store/reducer/addressBook'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

export const addressBookMapSelector = (state) =>
  state[ADDRESS_BOOK_REDUCER_ID].get('addressBook')

export const getAddressBook = createSelector(
  addressBookMapSelector,
  safeParamAddressFromStateSelector,
  (addressBook, safeAddress) => {
    let result = Map([])
    if (addressBook) {
      result = addressBook.get(safeAddress)
    }
    return result
  },
)

export const getAddressBookListSelector = createSelector(
  addressBookMapSelector,
  safeParamAddressFromStateSelector,
  (addressBook, safeAddress) => {
    let result = List([])
    if (addressBook) {
      result = List(addressBook.get(safeAddress))
    }
    return result
  },
)

export const GetNameFromAddressBook = (userAddress) => {
  const addressBook = useSelector(getAddressBook)
  
  if (!userAddress) {
    return null
  }
  const result = addressBook.filter((addressBookItem) => addressBookItem.address === userAddress)
  if (result.size > 0) {
    return result.get(0).name
  }
  return null
}
