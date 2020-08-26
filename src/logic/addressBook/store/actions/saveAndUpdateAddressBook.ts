import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { saveAddressBook } from 'src/logic/addressBook/utils'
import { Dispatch } from 'redux'

const saveAndUpdateAddressBook = (addressBook) => async (dispatch: Dispatch): Promise<void> => {
  try {
    dispatch(updateAddressBookEntry(makeAddressBookEntry(addressBook)))
    await saveAddressBook(addressBook)
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default saveAndUpdateAddressBook
