// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/safeStore'
import { saveAddressBook } from '~/logic/addressBook/utils'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { get3Box } from '~/utils/storage'

const saveAndUpdateAddressBook = (addressBook: AddressBook) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    dispatch(updateAddressBookEntry(addressBook))
    try {
      await get3Box()
      await saveAddressBook(addressBook, true)
    } catch (e) {
      await saveAddressBook(addressBook)
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default saveAndUpdateAddressBook
