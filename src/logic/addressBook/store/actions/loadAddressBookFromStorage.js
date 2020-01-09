// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { Map, List } from 'immutable'
import { type GlobalState } from '~/store/index'
import { getAddressBookFromStorage } from '~/logic/addressBook/utils'
import { loadAddressBook } from '~/logic/addressBook/store/actions/loadAddressBook'
import { safesListSelector } from '~/routes/safe/store/selectors'

const loadAddressBookFromStorage = () => async (dispatch: ReduxDispatch<GlobalState>, getState: Function) => {
  try {
    const state = getState()
    const addressBook = await getAddressBookFromStorage()
    let immutableAdbk = Map(addressBook)
    // Fetch all the current safes, in case that we don't have a safe on the adbk, we add it
    const safes = safesListSelector(state)
    const adbkEntries = Object.keys(addressBook)
    safes.forEach((safe) => {
      const { address } = safe
      const found = adbkEntries.includes(address)
      if (!found) {
        immutableAdbk = immutableAdbk.set(address, List([]))
      }
    })
    dispatch(loadAddressBook(immutableAdbk))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while loading active tokens from storage:', err)
  }
}

export default loadAddressBookFromStorage
