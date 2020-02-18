// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map, List } from 'immutable'
import { type GlobalState } from '~/store/index'
import { getAddressBookFromStorage } from '~/logic/addressBook/utils'
import { loadAddressBook } from '~/logic/addressBook/store/actions/loadAddressBook'
import { safesListSelector } from '~/routes/safe/store/selectors'
import { buildAddressBook } from '~/logic/addressBook/store/reducer/addressBook'

const loadAddressBookFromStorage = () => async (dispatch: ReduxDispatch<GlobalState>, getState: Function) => {
  try {
    const state = getState()
    let addressBook = await getAddressBookFromStorage()
    if (!addressBook) {
      addressBook = Map([])
    }
    addressBook = buildAddressBook(addressBook)
    // Fetch all the current safes, in case that we don't have a safe on the adbk, we add it
    const safes = safesListSelector(state)
    const adbkEntries = addressBook.keySeq().toArray()
    safes.forEach(safe => {
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
