import { createSelector } from 'reselect'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { ADDRESS_BOOK_DEFAULT_NAME, AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentChainId } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'
import { checksumAddress } from 'src/utils/checksumAddress'
import { isValidAddress } from 'src/utils/isValidAddress'

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
    currentChainId,
    (_, { address, chainId }: GetNameParams): { address: string; chainId?: ETHEREUM_NETWORK } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, curChainId, { address, chainId }) => {
    return getNameByAddress(addressBook, address, chainId || curChainId) || ADDRESS_BOOK_DEFAULT_NAME
  },
)

export const addressBookName = createSelector(
  [
    addressBookAsMap,
    currentChainId,
    (_, { address, chainId }: GetNameParams): { address: string; chainId?: ETHEREUM_NETWORK } => ({
      address,
      chainId,
    }),
  ],
  (addressBook, curChainId, { address, chainId }) => {
    return getNameByAddress(addressBook, address, chainId || curChainId)
  },
)

/*********************/
/* Connected Network */
/*********************/

export const currentNetworkAddressBook = createSelector(
  [addressBookState, currentChainId],
  (addressBook, curChainId): AppReduxState['addressBook'] => {
    return addressBook.filter(({ chainId }) => chainId.toString() === curChainId)
  },
)

export const currentNetworkAddressBookAddresses = createSelector(
  [currentNetworkAddressBook],
  (addressBook): string[] => {
    return addressBook.map(({ address }) => address)
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
