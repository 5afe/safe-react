import { List } from 'immutable'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { SafeOwner } from 'src/logic/safe/store/models/safe'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export const getAddressBookFromStorage = async (): Promise<AddressBookState | undefined> => {
  const result: string | undefined = await loadFromStorage(ADDRESS_BOOK_STORAGE_KEY)

  return result ? JSON.parse(result) : result
}

export const saveAddressBook = async (addressBook: AddressBookState): Promise<void> => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, JSON.stringify(addressBook))
  } catch (err) {
    console.error('Error storing addressBook in localstorage', err)
  }
}

export const getAddressesListFromAdbk = (addressBook: AddressBookState): string[] =>
  addressBook.map((entry) => entry.address)

export const getNameFromAdbk = (addressBook: AddressBookState, userAddress: string): string | null => {
  const entry = addressBook.find((addressBookItem) => addressBookItem.address === userAddress)
  if (entry) {
    return entry.name
  }
  return null
}

export const getValidAddressBookName = (addressbookName: string): string | null => {
  const INVALID_NAMES = ['UNKNOWN', 'OWNER #', 'MY WALLET']
  const isInvalid = INVALID_NAMES.find((invalidName) => addressbookName.toUpperCase().includes(invalidName))
  if (isInvalid) return null
  return addressbookName
}

export const getOwnersWithNameFromAddressBook = (
  addressBook: AddressBookState,
  ownerList: List<SafeOwner>,
): List<SafeOwner> | [] => {
  if (!ownerList) {
    return []
  }
  return ownerList.map((owner) => {
    const ownerName = getNameFromAdbk(addressBook, owner.address)
    return {
      address: owner.address,
      name: ownerName || owner.name,
    }
  })
}
