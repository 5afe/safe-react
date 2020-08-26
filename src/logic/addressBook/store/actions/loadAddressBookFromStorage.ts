import { List } from 'immutable'

import { loadAddressBook } from 'src/logic/addressBook/store/actions/loadAddressBook'
import { buildAddressBook } from 'src/logic/addressBook/store/reducer/addressBook'
import { getAddressBookFromStorage } from 'src/logic/addressBook/utils'
import { safesListSelector } from 'src/logic/safe/store/selectors'
import { Dispatch } from 'redux'
import { AppReduxState } from 'src/store'

const loadAddressBookFromStorage = () => async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
  try {
    const state = getState()
    let storedAdBk = await getAddressBookFromStorage()
    if (!storedAdBk) {
      storedAdBk = []
    }

    let addressBook = buildAddressBook(storedAdBk)
    // Fetch all the current safes, in case that we don't have a safe on the adbk, we add it
    const safes = safesListSelector(state)
    const adbkEntries = addressBook.keySeq().toArray()
    safes.forEach((safe) => {
      const { address } = safe
      const found = adbkEntries.includes(address)
      if (!found) {
        addressBook = addressBook.set(address, List([]))
      }
    })
    dispatch(loadAddressBook(addressBook))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadAddressBookFromStorage
