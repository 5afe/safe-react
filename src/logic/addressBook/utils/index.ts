import { mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { AddressBookEntry, AddressBookState } from 'src/logic/addressBook/model/addressBook'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'

export type OldAddressBookEntry = {
  address: string
  name: string
  isOwner: boolean
}

export type OldAddressBookType = {
  [safeAddress: string]: [OldAddressBookEntry]
}

export const ADDRESS_BOOK_INVALID_NAMES = ['UNKNOWN', 'OWNER #', 'MY WALLET']

export const isValidAddressBookName = (addressBookName: string): boolean => {
  const hasInvalidName = ADDRESS_BOOK_INVALID_NAMES.find((invalidName) =>
    addressBookName?.toUpperCase().includes(invalidName),
  )
  return !hasInvalidName
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
