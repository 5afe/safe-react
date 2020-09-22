import { List } from 'immutable'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { SafeOwner } from 'src/logic/safe/store/models/safe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

const ADDRESS_BOOK_STORAGE_KEY = 'ADDRESS_BOOK_STORAGE_KEY'

export type OldAddressBookEntry = {
  address: string
  name: string
  isOwner: boolean
}

export type OldAddressBookType = {
  [safeAddress: string]: [OldAddressBookEntry]
}

const ADDRESSBOOK_INVALID_NAMES = ['UNKNOWN', 'OWNER #', 'MY WALLET']

export const migrateOldAddressBook = (oldAddressBook: OldAddressBookType): AddressBookState => {
  const values: AddressBookState = []
  const adbkValues = Object.values(oldAddressBook)

  for (const safeIterator of adbkValues) {
    for (const safeAddressBook of safeIterator) {
      if (!values.find((entry) => sameAddress(entry.address, safeAddressBook.address))) {
        values.push(makeAddressBookEntry({ address: safeAddressBook.address, name: safeAddressBook.name }))
      }
    }
  }

  return values
}

export const getAddressBookFromStorage = async (): Promise<AddressBookState | null> => {
  const result: OldAddressBookType | string | undefined = await loadFromStorage(ADDRESS_BOOK_STORAGE_KEY)

  if (!result) {
    return null
  }

  if (typeof result === 'string') {
    return JSON.parse(result)
  }

  return migrateOldAddressBook(result as OldAddressBookType)
}

export const saveAddressBook = async (addressBook: AddressBookState): Promise<void> => {
  try {
    await saveToStorage(ADDRESS_BOOK_STORAGE_KEY, JSON.stringify(addressBook))
  } catch (err) {
    console.error('Error storing addressBook in localstorage', err)
  }
}

export const getAddressesListFromAddressBook = (addressBook: AddressBookState): string[] =>
  addressBook.map((entry) => entry.address)

type GetNameFromAddressBookOptions = {
  filterOnlyValidName: boolean
}

export const getNameFromAddressBook = (
  addressBook: AddressBookState,
  userAddress: string,
  options?: GetNameFromAddressBookOptions,
): string | null => {
  const entry = addressBook.find((addressBookItem) => addressBookItem.address === userAddress)
  if (entry) {
    return options?.filterOnlyValidName ? getValidAddressBookName(entry.name) : entry.name
  }
  return null
}

export const isValidAddressBookName = (addressBookName: string): boolean => {
  const hasInvalidName = ADDRESSBOOK_INVALID_NAMES.find((invalidName) =>
    addressBookName.toUpperCase().includes(invalidName),
  )
  return !hasInvalidName
}

export const getValidAddressBookName = (addressBookName: string): string | null => {
  return isValidAddressBookName(addressBookName) ? addressBookName : null
}

export const getOwnersWithNameFromAddressBook = (
  addressBook: AddressBookState,
  ownerList: List<SafeOwner>,
): List<SafeOwner> => {
  if (!ownerList) {
    return List([])
  }
  return ownerList.map((owner) => {
    const ownerName = getNameFromAddressBook(addressBook, owner.address)
    return {
      address: owner.address,
      name: ownerName || owner.name,
    }
  })
}

export const formatAddressListToAddressBookNames = (
  addressBook: AddressBookState,
  addresses: string[],
): AddressBookEntry[] => {
  if (!addresses.length) {
    return []
  }
  return addresses.map((address) => {
    const ownerName = getNameFromAddressBook(addressBook, address)
    return {
      address: address,
      name: ownerName || '',
    }
  })
}

/**
 * If the safe is not loaded, the owner wasn't not deleted
 * If the safe is already loaded and the owner has a valid name, will return true if the address is not already on the addressBook
 * @param name
 * @param address
 * @param addressBook
 * @param safeAlreadyLoaded
 */
export const checkIfEntryWasDeletedFromAddressBook = (
  { name, address }: AddressBookEntry,
  addressBook: AddressBookState,
  safeAlreadyLoaded: boolean,
): boolean => {
  if (!safeAlreadyLoaded) {
    return false
  }

  const addressShouldBeOnTheAddressBook = !!getValidAddressBookName(name)
  const isAlreadyInAddressBook = !!addressBook.find((entry) => sameAddress(entry.address, address))
  return addressShouldBeOnTheAddressBook && !isAlreadyInAddressBook
}
