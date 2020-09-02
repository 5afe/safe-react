import { List } from 'immutable'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { AddressBookEntryProps } from './../model/addressBook'
import { SafeOwner } from 'src/logic/safe/store/models/safe'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export const getAddressBookFromStorage = async (): Promise<Array<AddressBookEntryProps> | undefined> => {
  const data = await loadFromStorage<Array<AddressBookEntryProps>>(ADDRESS_BOOK_STORAGE_KEY)

  return data
}

export const saveAddressBook = async (addressBook) => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, addressBook.toJSON())
  } catch (err) {
    console.error('Error storing addressBook in localstorage', err)
  }
}

export const getAddressesListFromAdbk = (addressBook: List<any>) => addressBook.map((entry: any) => entry.address)

export const getNameFromAdbk = (addressBook, userAddress) => {
  const entry = addressBook.find((addressBookItem) => addressBookItem.address === userAddress)
  if (entry) {
    return entry.name
  }
  return null
}

export const getOwnersWithNameFromAddressBook = (
  addressBook: AddressBookEntryProps,
  ownerList: List<SafeOwner>,
): List<SafeOwner> | [] => {
  if (!ownerList) {
    return []
  }
  const ownersListWithAdbkNames = ownerList.map((owner) => {
    const ownerName = getNameFromAdbk(addressBook, owner.address)
    return {
      address: owner.address,
      name: ownerName || owner.name,
    }
  })
  return ownersListWithAdbkNames
}
