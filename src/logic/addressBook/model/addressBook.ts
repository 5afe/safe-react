import { Record, RecordOf } from 'immutable'

export interface AddressBookEntryProps {
  address: string
  name: string
  isOwner: boolean
}

export type AddressBookEntryRecord = RecordOf<AddressBookEntryProps>

export const makeAddressBookEntry = Record<AddressBookEntryProps>({
  address: '',
  name: '',
  isOwner: false,
})

export type AddressBookEntry = RecordOf<AddressBookEntryProps>
