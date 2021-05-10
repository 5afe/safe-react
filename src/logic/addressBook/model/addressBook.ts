import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

export type AddressBookEntry = {
  address: string // the contact address
  name: string // human-readable name
  chainId: ETHEREUM_NETWORK // see https://chainid.network
}

export const makeAddressBookEntry = ({
  address = '',
  name = '',
  chainId = ETHEREUM_NETWORK.UNKNOWN,
}: {
  address: string
  name?: string
  chainId?: number
}): AddressBookEntry => ({
  address,
  name,
  chainId,
})

export type AddressBookState = AddressBookEntry[]
