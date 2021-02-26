import { AppReduxState } from 'src/store'

import { createSelector } from 'reselect'

import { ADDRESS_BOOK_REDUCER_ID } from 'src/logic/addressBook/store/reducer/addressBook'

import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

export const addressBookSelector = (state: AppReduxState): AddressBookState => state[ADDRESS_BOOK_REDUCER_ID]

export const addressBookAddressesListSelector = (state: AppReduxState): string[] => {
  const addressBook = addressBookSelector(state)
  return addressBook.map((entry) => entry.address)
}

export const getNameFromAddressBookSelector = createSelector(
  addressBookSelector,
  (_, address) => address,
  (addressBook, address) => {
    const adbkEntry = addressBook.find((addressBookItem) => addressBookItem.address === address)

    if (adbkEntry) {
      return adbkEntry.name
    }
    return 'UNKNOWN'
  },
)
