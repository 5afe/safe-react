// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { getAddressBookFromStorage } from '~/logic/addressBook/utils'
import { addAddressBook } from '~/logic/addressBook/store/actions/addAddressBook'

const loadAddressBook = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const addressBook = await getAddressBookFromStorage()

    dispatch(addAddressBook(addressBook))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadAddressBook
