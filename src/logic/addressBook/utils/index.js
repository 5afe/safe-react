// @flow
import { Map } from 'immutable'
import type { AddressBookProps } from '~/logic/addressBook/model/addressBook'
import { loadFromStorage, saveToStorage } from '~/utils/storage'
import type { Token } from '~/logic/tokens/store/model/token'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export const getAddressBookFromStorage = async (): Promise<AddressBookProps> => {
  const data = await loadFromStorage(ADDRESS_BOOK_STORAGE_KEY)

  return data || []
}

export const saveAddressBook = async (tokens: Map<string, Token>) => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, tokens.toJS())
  } catch (err) {
    console.error('Error storing tokens in localstorage', err)
  }
}
