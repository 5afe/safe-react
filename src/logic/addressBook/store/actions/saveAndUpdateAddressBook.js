// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/safeStore'
import { saveAddressBook } from '~/logic/addressBook/utils'
import { updateAddressBook } from '~/logic/addressBook/store/actions/updateAddressBook'
import type { AddressBook } from '~/logic/addressBook/model/addressBook'

const saveAndUpdateAddressBook = (addressBook: AddressBook) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    dispatch(updateAddressBook(addressBook))
    await saveAddressBook(addressBook)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default saveAndUpdateAddressBook
