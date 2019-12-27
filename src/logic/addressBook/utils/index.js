// @flow
import { useSelector } from 'react-redux'
import type { AddressBook, AddressBookProps } from '~/logic/addressBook/model/addressBook'
import { loadFromStorage, saveToStorage } from '~/utils/storage'
import { getAddressBook } from '~/logic/addressBook/store/selectors'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export const getAddressBookFromStorage = async (): Promise<AddressBookProps> => {
  const data = await loadFromStorage(ADDRESS_BOOK_STORAGE_KEY)

  return data || []
}

export const saveAddressBook = async (addressBook: AddressBook) => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, addressBook.toJS())
  } catch (err) {
    console.error('Error storing addressBook in localstorage', err)
  }
}

export const getNameFromAddressBook = (userAddress: string): string | null => {
  if (!userAddress) {
    return null
  }
  const addressBook = useSelector(getAddressBook)
  const result = addressBook.filter((addressBookItem) => addressBookItem.address === userAddress)
  if (result.size > 0) {
    return result.get(0).name
  }
  return null
}
