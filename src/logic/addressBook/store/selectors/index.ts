import { createSelector } from 'reselect'

import { ADDRESS_BOOK_DEFAULT_NAME, AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { getEntryIndex } from 'src/logic/addressBook/utils'
import { AppReduxState } from 'src/store'
import { Overwrite } from 'src/types/helpers'

export const addressBookSelector = (state: AppReduxState): AppReduxState['addressBook'] => state['addressBook']

export const addressBookAddressesListSelector = createSelector([addressBookSelector], (addressBook): string[] =>
  addressBook.map(({ address }) => address),
)

type GetNameParams = Overwrite<AddressBookEntry, { name?: string }>

export const getNameFromAddressBookSelector = createSelector(
  [addressBookSelector, (_, { address, chainId }: GetNameParams): GetNameParams => ({ address, chainId })],
  (addressBook, entry) => {
    const entryIndex = getEntryIndex(addressBook, entry)

    if (entryIndex >= 0) {
      return addressBook[entryIndex].name
    }

    return ADDRESS_BOOK_DEFAULT_NAME
  },
)
