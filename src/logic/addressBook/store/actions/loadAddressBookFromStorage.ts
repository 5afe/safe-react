import { loadAddressBook } from 'src/logic/addressBook/store/actions/loadAddressBook'
import { buildAddressBook } from 'src/logic/addressBook/store/reducer/addressBook'
import { getAddressBookFromStorage } from 'src/logic/addressBook/utils'
import { Dispatch } from 'redux'

const loadAddressBookFromStorage = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    let storedAdBk = await getAddressBookFromStorage()
    if (!storedAdBk) {
      storedAdBk = []
    }

    const addressBook = buildAddressBook(storedAdBk)

    dispatch(loadAddressBook(addressBook))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadAddressBookFromStorage
