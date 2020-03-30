// @flow
import { Record, type RecordFactory, type RecordOf } from 'immutable'

export type AddressBookEntry = {
  address: string,
  name: string,
  isOwner: boolean,
}

export type AddressBookProps = {
  addressBook: Map<string, AddressBookEntry>,
}

export const makeAddressBookEntry: RecordFactory<AddressBookEntry> = Record({
  address: '',
  name: '',
  isOwner: false,
})

export type AddressBook = RecordOf<AddressBookProps>
