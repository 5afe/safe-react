import { List } from 'immutable'
import { createSelector } from 'reselect'

import {
  ADDRESS_BOOK_REDUCER_ID,
  AddressBookCollection,
  AddressBookState,
} from 'src/logic/addressBook/store/reducer/addressBook'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { AppReduxState } from 'src/store'

export const addressBookMapSelector = (state: AppReduxState): AddressBookState => state[ADDRESS_BOOK_REDUCER_ID]

export const addressBookCollectionSelector = createSelector(addressBookMapSelector, (state) => state.get('addressBook'))

export const getAddressBook = createSelector(
  addressBookCollectionSelector,
  safeParamAddressFromStateSelector,
  (addressBook, safeAddress): AddressBookCollection | undefined => {
    if (addressBook && safeAddress) {
      return addressBook.get(safeAddress)
    }
  },
)

export const getAddressBookListSelector = createSelector(
  addressBookCollectionSelector,
  safeParamAddressFromStateSelector,
  (addressBook, safeAddress): AddressBookCollection | undefined => {
    if (addressBook && safeAddress) {
      return List(addressBook.get(safeAddress))
    }
  },
)

export const getNameFromAddressBook = createSelector(
  getAddressBookListSelector,
  (_, address: string): string => address,
  (addressBook, address: string): string => {
    const adbkEntry = addressBook?.find((addressBookItem) => addressBookItem.address === address)

    if (adbkEntry) {
      return adbkEntry.name
    }

    return 'UNKNOWN'
  },
)
