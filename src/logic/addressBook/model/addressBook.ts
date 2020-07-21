import { Record, RecordOf } from 'immutable'

export interface AddressBookEntryProps {
  address: string
  name: string
  isOwner: boolean
}

export const makeAddressBookEntry = Record<AddressBookEntryProps>({
  address: '',
  name: '',
  isOwner: false,
})

export type AddressBook = RecordOf<AddressBookEntryProps>
