import { ChainId } from 'src/config/chain.d'

export const ADDRESS_BOOK_DEFAULT_NAME = 'UNKNOWN'

export type AddressBookEntry = {
  address: string // the contact address
  name: string // human-readable name
  chainId: ChainId // see https://chainid.network
}

export const makeAddressBookEntry = ({
  address,
  name,
  chainId,
}: {
  address: string
  name: string
  chainId: ChainId
}): AddressBookEntry => ({
  address,
  name,
  chainId,
})

export type AddressBookState = AddressBookEntry[]
