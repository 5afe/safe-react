import { List } from 'immutable'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { AddressBookEntryProps, AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { SafeOwner } from 'src/logic/safe/store/models/safe'
import { AddressBookCollection, AddressBookState } from 'src/logic/addressBook/store/reducer/addressBook'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export const getAddressBookFromStorage = async (): Promise<Array<AddressBookEntryProps> | undefined> => {
  return await loadFromStorage<Array<AddressBookEntryProps>>(ADDRESS_BOOK_STORAGE_KEY)
}

export const saveAddressBook = async (addressBook: AddressBookState): Promise<void> => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, addressBook.toJSON())
  } catch (err) {
    console.error('Error storing addressBook in localstorage', err)
  }
}

export const getAddressesListFromAdbk = (addressBook: AddressBookCollection): string[] =>
  Array.from(addressBook).map((entry: AddressBookEntry) => entry.address)

export const getNameFromAdbk = (addressBook: AddressBookCollection, userAddress: string): string | null => {
  const entry = addressBook.find((addressBookItem) => addressBookItem.address === userAddress)
  if (entry) {
    return entry.name
  }
  return null
}

export const getOwnersWithNameFromAddressBook = (
  addressBook: AddressBookCollection,
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
