import { createSelector } from 'reselect'

import { getNetworkId } from 'src/config'
import { ADDRESS_BOOK_DEFAULT_NAME, AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'
import { checksumAddress } from 'src/utils/checksumAddress'
import { isValidAddress } from 'src/utils/isValidAddress'

const networkId = getNetworkId()

export const addressBookFromQueryParams = (state: AppReduxState): string | undefined => {
  return state.router.location?.query?.entryAddress
}

export const addressBookState = (state: AppReduxState): AppReduxState['addressBook'] => state['addressBook']

export const addressBookAddresses = createSelector([addressBookState], (addressBook): string[] => {
  return addressBook.map(({ address }) => address)
})

type AddressBookMap = {
  [address: string]: AddressBookEntry
}

type AddressBookMapByChain = {
  [chainId: number]: AddressBookMap
}

export const addressBookAsMap = createSelector(
  [addressBookState],
  (addressBook): AddressBookMapByChain => {
    const addressBookMap = {}

    addressBook.forEach((entry) => {
      const { address, chainId } = entry
      if (!addressBookMap[chainId]) {
        addressBookMap[chainId] = { [address]: entry }
      } else {
        addressBookMap[chainId][address] = entry
      }
    })

    return addressBookMap
  },
)

type GetNameParams = Overwrite<Partial<AddressBookEntry>, { address: string }>

export const addressBookEntryName = createSelector(
  [
    addressBookAsMap,
    (_, { address, chainId = networkId }: GetNameParams): { address: string; chainId: number } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, { address, chainId }) => {
    if (isValidAddress(address)) {
      return addressBook?.[chainId]?.[checksumAddress(address)]?.name ?? ADDRESS_BOOK_DEFAULT_NAME
    }

    return ADDRESS_BOOK_DEFAULT_NAME
  },
)

/*********************/
/* Connected Network */
/*********************/

export const currentNetworkAddressBook = createSelector(
  [addressBookState],
  (addressBook): AppReduxState['addressBook'] => {
    return addressBook.filter(({ chainId }) => chainId === networkId)
  },
)

export const currentNetworkAddressBookAsMap = createSelector(
  [currentNetworkAddressBook],
  (addressBook): AddressBookMap => {
    const addressBookMap = {}

    addressBook.forEach((entry) => {
      addressBookMap[entry.address] = entry
    })

    return addressBookMap
  },
)
