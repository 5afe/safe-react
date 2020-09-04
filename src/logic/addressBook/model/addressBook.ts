export type AddressBookEntry = {
  address: string
  name: string
}

// todo remove
export const makeAddressBookEntry = ({
  address = '',
  name = '',
}: {
  address: string
  name?: string
}): AddressBookEntry => ({
  address,
  name,
})

export type AddressBookState = AddressBookEntry[]
