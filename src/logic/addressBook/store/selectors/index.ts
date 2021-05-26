import { createSelector } from 'reselect'

import { getNetworkId } from 'src/config'
import { ADDRESS_BOOK_DEFAULT_NAME, AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'

const networkId = getNetworkId()

export const addressBookSelector = (state: AppReduxState): AppReduxState['addressBook'] => state['addressBook']

type AddressBookMap = {
  [chainId: number]: {
    [address: string]: AddressBookEntry
  }
}

export const addressBookMapSelector = createSelector(
  [addressBookSelector],
  (addressBook): AddressBookMap => {
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

export const addressBookAddressesListSelector = createSelector([addressBookSelector], (addressBook): string[] =>
  addressBook.map(({ address }) => address),
)

type GetNameParams = Overwrite<
  AddressBookEntry,
  { chainId?: AddressBookEntry['chainId']; name?: AddressBookEntry['name'] }
>

type GetNameReturnObject = Overwrite<GetNameParams, { chainId: AddressBookEntry['chainId'] }>

export const getNameFromAddressBookSelector = createSelector(
  [
    addressBookMapSelector,
    (_, { address, chainId = networkId }: GetNameParams): GetNameReturnObject => ({
      address,
      chainId,
    }),
  ],
  (addressBook, entry) => addressBook?.[entry.chainId]?.[entry.address]?.name ?? ADDRESS_BOOK_DEFAULT_NAME,
)
