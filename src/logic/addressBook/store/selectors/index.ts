import { List, Map } from 'immutable'
import { createSelector } from 'reselect'

import { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer/addressBook'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'

export const addressBookMapSelector = (state) => state[ADDRESS_BOOK_REDUCER_ID].get('addressBook')

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

export const getNameFromAddressBook = createSelector(
  getAddressBookListSelector,
  (_, address) => address,
  (addressBook, address) => {
    const adbkEntry = addressBook.find((addressBookItem) => addressBookItem.address === address)
    if (adbkEntry) {
      return adbkEntry.name
    }

    return 'UNKNOWN'
  },
)
