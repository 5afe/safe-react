// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { saveAddressBook } from '~/logic/addressBook/utils'
import { type GlobalState } from '~/store/index'

const saveAndUpdateAddressBook = (addressBook: AddressBook) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    dispatch(updateAddressBookEntry(addressBook))
    await saveAddressBook(addressBook)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default saveAndUpdateAddressBook
