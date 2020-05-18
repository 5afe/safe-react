// 

import { makeAddressBookEntry } from '~/logic/addressBook/model/addressBook'
import { updateAddressBookEntry } from '~/logic/addressBook/store/actions/updateAddressBookEntry'
import { saveAddressBook } from '~/logic/addressBook/utils'
import { } from '~/store/index'

const saveAndUpdateAddressBook = (addressBook) => async (dispatch) => {
  try {
    dispatch(updateAddressBookEntry(makeAddressBookEntry(addressBook)))
    await saveAddressBook(addressBook)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default saveAndUpdateAddressBook
