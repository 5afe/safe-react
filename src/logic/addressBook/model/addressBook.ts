import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { getNetworkId } from 'src/config'

export const ADDRESS_BOOK_DEFAULT_NAME = 'UNKNOWN'

export type AddressBookEntry = {
  address: string // the contact address
  name: string // human-readable name
  chainId: ETHEREUM_NETWORK // see https://chainid.network
}

const networkId = getNetworkId()

export const makeAddressBookEntry = ({
  address,
  name,
  chainId = networkId,
}: {
  address: string
  name: string
  chainId?: number
}): AddressBookEntry => ({
  address,
  name,
  chainId,
})

export type AddressBookState = AddressBookEntry[]
