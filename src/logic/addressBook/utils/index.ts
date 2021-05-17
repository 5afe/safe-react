import { List } from 'immutable'

import { mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { AddressBookEntry, AddressBookState, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { SafeOwner } from 'src/logic/safe/store/models/safe'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'
import { getNetworkName } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { removeFromStorage } from 'src/utils/storage'

export type OldAddressBookEntry = {
  address: string
  name: string
  isOwner: boolean
}

export type OldAddressBookType = {
  [safeAddress: string]: [OldAddressBookEntry]
}

const ADDRESS_BOOK_INVALID_NAMES = ['UNKNOWN', 'OWNER #', 'MY WALLET']

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
  // TODO: this is filtering names that includes any of the keywords in the `ADDRESS_BOOK_INVALID_NAMES`
  //  So a name in the order of 'This is an unknown user' will be filtered too. Is this intentional?
  const hasInvalidName = ADDRESS_BOOK_INVALID_NAMES.find((invalidName) =>
    addressBookName.toUpperCase().includes(invalidName),
  )
  return !hasInvalidName
}

// TODO: is this really required?
export const getValidAddressBookName = (addressBookName: string): string | null => {
  return isValidAddressBookName(addressBookName) ? addressBookName : null
}

// TODO: Shouldn't this be implemented as a selector?
//  or it's used to extract data from the `localStorage`?
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
      name: ownerName || '',
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
      chainId: ETHEREUM_NETWORK.UNKNOWN,
    }
  })
}

/**
 * If the safe is not loaded, the owner wasn't deleted
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

/**
 * Returns a filtered list of AddressBookEntries whose addresses are contracts
 * @param {Array<AddressBookEntry>} addressBook
 * @returns Array<AddressBookEntry>
 */
export const filterContractAddressBookEntries = async (addressBook: AddressBookState): Promise<AddressBookEntry[]> => {
  const abFlags = await Promise.all(
    addressBook.map(
      async ({ address }: AddressBookEntry): Promise<boolean> => {
        return (await mustBeEthereumContractAddress(address)) === undefined
      },
    ),
  )

  return addressBook.filter((_, index) => abFlags[index])
}

/**
 * Filters the AddressBookEntries by `address` or `name` based on the `inputValue`
 * @param {Array<AddressBookEntry>} addressBookEntries
 * @param {Object} filterParams
 * @param {String} filterParams.inputValue
 * @return Array<AddressBookEntry>
 */
export const filterAddressEntries = (
  addressBookEntries: AddressBookEntry[],
  { inputValue }: { inputValue: string },
): AddressBookEntry[] =>
  addressBookEntries.filter(({ address, name }) => {
    const inputLowerCase = inputValue.toLowerCase()
    const foundName = name.toLowerCase().includes(inputLowerCase)
    const foundAddress = address?.toLowerCase().includes(inputLowerCase)

    return foundName || foundAddress
  })

export const getEntryIndex = (
  state: AppReduxState['addressBook'],
  addressBookEntry: Overwrite<AddressBookEntry, { name?: string }>,
): number =>
  state.findIndex(
    ({ address, chainId }) => chainId === addressBookEntry.chainId && sameAddress(address, addressBookEntry.address),
  )

/**
 * Migrates the AddressBook from a per-network to a global storage
 * under the key `ADDRESS_BOOK` in `localStorage`
 *
 * @note Also, adds `chainId` to every entry in the AddressBook list
 * @note the migrated structure will be `{ address, name, chainId }`
 */
export const migrateAddressBook = ({
  states,
  namespace,
  namespaceSeparator,
}: {
  states: string[]
  namespace: string
  namespaceSeparator: string
}): void => {
  const [state] = states
  const PREFIX = `v2_${getNetworkName()}`
  const storedAddressBook = localStorage.getItem(`_immortal|${PREFIX}__ADDRESS_BOOK_STORAGE_KEY`)

  if (storedAddressBook === null) {
    // nothing left to migrate
    return
  }

  const migratedAddressBook = JSON.parse(storedAddressBook).map(({ address, ...entry }) =>
    makeAddressBookEntry({
      address: checksumAddress(address),
      ...entry,
    }),
  )

  try {
    localStorage.setItem(`${namespace}${namespaceSeparator}${state}`, JSON.stringify(migratedAddressBook))
    removeFromStorage('ADDRESS_BOOK_STORAGE_KEY').then(() => console.info('legacy Address Book removed'))
  } catch (error) {
    console.error('failed to persist the migrated address book', error.message)
  }
}
