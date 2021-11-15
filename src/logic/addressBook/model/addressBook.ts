import { currentNetworkId } from 'src/logic/config/store/selectors'
import { store } from 'src/store'
import { ETHEREUM_NETWORK } from 'src/types/network.d'

export const ADDRESS_BOOK_DEFAULT_NAME = 'UNKNOWN'

export type AddressBookEntry = {
  address: string // the contact address
  name: string // human-readable name
  chainId: ETHEREUM_NETWORK // see https://chainid.network
}

export const makeAddressBookEntry = ({
  address,
  name,
  chainId = currentNetworkId(store.getState()),
}: {
  address: string
  name: string
  chainId?: ETHEREUM_NETWORK
}): AddressBookEntry => ({
  address,
  name,
  chainId,
})

export type AddressBookState = AddressBookEntry[]
