import { List } from 'immutable'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
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

export const getNameFromAddressBook = (addressBook: AddressBookState, userAddress: string): string | null => {
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
