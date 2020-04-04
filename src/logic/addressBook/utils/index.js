// 
import { useSelector } from 'react-redux'

import { getAddressBook } from 'logic/addressBook/store/selectors'
import { loadFromStorage, saveToStorage } from 'utils/storage'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export const getAddressBookFromStorage = async () => {
  const data = await loadFromStorage(ADDRESS_BOOK_STORAGE_KEY)

  return data || []
}

export const saveAddressBook = async (addressBook) => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, addressBook.toJSON())
  } catch (err) {
    console.error('Error storing addressBook in localstorage', err)
  }
}

export const getAddressesListFromAdbk = (addressBook) =>
  Array.from(addressBook).map((entry) => entry.address)

const getNameFromAdbk = (addressBook, userAddress) => {
  const entry = addressBook.find((addressBookItem) => addressBookItem.address === userAddress)
  if (entry) {
    return entry.name
  }
  return null
}

export const getNameFromAddressBook = (userAddress) => {
  if (!userAddress) {
    return null
  }
  const addressBook = useSelector(getAddressBook)
  return getNameFromAdbk(addressBook, userAddress)
}

export const getOwnersWithNameFromAddressBook = (addressBook, ownerList) => {
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
