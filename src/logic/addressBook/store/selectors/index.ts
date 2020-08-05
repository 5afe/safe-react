import { AppReduxState } from 'src/store'
import { List } from 'immutable'
import { createSelector } from 'reselect'

import { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer/addressBook'
import { AddressBookMap } from 'src/logic/addressBook/store/reducer/types/addressBook.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'

export const addressBookMapSelector = (state: AppReduxState): AddressBookMap =>
  state[ADDRESS_BOOK_REDUCER_ID].get('addressBook')

export const getAddressBook = createSelector(
  addressBookMapSelector,
  safeParamAddressFromStateSelector,
  (addressBook, safeAddress) => {
    let result = List([])
    if (addressBook) {
      result = addressBook.get(safeAddress, List())
    }
    return result
  },
)

export const getNameFromAddressBook = createSelector(
  getAddressBook,
  (_, address) => address,
  (addressBook, address) => {
    const adbkEntry = addressBook.find((addressBookItem) => addressBookItem.address === address)
    if (adbkEntry) {
      return adbkEntry.name
    }

    return 'UNKNOWN'
  },
)
