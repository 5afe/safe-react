import { ChainId, _getChainId } from 'src/config'

export const ADDRESS_BOOK_DEFAULT_NAME = 'UNKNOWN'

export type AddressBookEntry = {
  address: string // the contact address
  name: string // human-readable name
  chainId: ChainId // see https://chainid.network
}

export const makeAddressBookEntry = ({
  address,
  name,
  chainId = _getChainId(),
}: {
  address: string
  name: string
  chainId?: ChainId
}): AddressBookEntry => ({
  address,
  name,
  chainId,
})

export type AddressBookState = AddressBookEntry[]
