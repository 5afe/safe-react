import { createSelector } from 'reselect'

import { getNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { ADDRESS_BOOK_DEFAULT_NAME, AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'
import { checksumAddress } from 'src/utils/checksumAddress'
import { isValidAddress } from 'src/utils/isValidAddress'

const networkId = getNetworkId()

export const addressBookState = (state: AppReduxState): AppReduxState['addressBook'] => state['addressBook']

export const addressBookAddresses = createSelector([addressBookState], (addressBook): string[] => {
  return addressBook.map(({ address }) => address)
})

type AddressBookMap = {
  [address: string]: AddressBookEntry
}

type AddressBookMapByChain = {
  [chainId: string]: AddressBookMap
}

export const addressBookAsMap = createSelector([addressBookState], (addressBook): AddressBookMapByChain => {
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
})

const getNameByAddress = (addressBook, address: string, chainId: ETHEREUM_NETWORK): string => {
  if (!isValidAddress(address)) {
    return ''
  }
  return addressBook?.[chainId]?.[checksumAddress(address)]?.name || ''
}

type GetNameParams = Overwrite<Partial<AddressBookEntry>, { address: string }>

export const addressBookEntryName = createSelector(
  [
    addressBookAsMap,
    (_, { address, chainId = networkId }: GetNameParams): { address: string; chainId: ETHEREUM_NETWORK } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, { address, chainId }) => {
    return getNameByAddress(addressBook, address, chainId) || ADDRESS_BOOK_DEFAULT_NAME
  },
)

export const addressBookName = createSelector(
  [
    addressBookAsMap,
    (_, { address, chainId = networkId }: GetNameParams): { address: string; chainId: ETHEREUM_NETWORK } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, { address, chainId }) => {
    return getNameByAddress(addressBook, address, chainId)
  },
)

/*********************/
/* Connected Network */
/*********************/

export const currentNetworkAddressBook = createSelector(
  [addressBookState],
  (addressBook): AppReduxState['addressBook'] => {
    return addressBook.filter(({ chainId }) => chainId.toString() === networkId)
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
