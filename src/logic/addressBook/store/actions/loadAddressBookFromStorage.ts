import { loadAddressBook } from 'src/logic/addressBook/store/actions/loadAddressBook'
import { buildAddressBook } from 'src/logic/addressBook/store/reducer/addressBook'
import { getAddressBookFromStorage } from 'src/logic/addressBook/utils'
import { safesListSelector } from 'src/logic/safe/store/selectors'
import { Dispatch } from 'redux'
import { AppReduxState } from 'src/store'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'

const loadAddressBookFromStorage = () => async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
  try {
    const state = getState()
    let storedAdBk = await getAddressBookFromStorage()
    if (!storedAdBk) {
      storedAdBk = []
    }

    const addressBook = buildAddressBook(storedAdBk)
    // Fetch all the current safes, in case that we don't have a safe on the addressBook, we add it
    const safes = safesListSelector(state)
    safes.forEach((safe) => {
      const { address } = safe
      const found = addressBook.find((entry) => entry.address === address)
      if (!found) {
        addressBook.push(makeAddressBookEntry({ address }))
      }
    })
    dispatch(loadAddressBook(addressBook))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadAddressBookFromStorage
