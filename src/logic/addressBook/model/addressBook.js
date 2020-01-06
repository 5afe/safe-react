// @flow
import type { RecordOf } from 'immutable'

export type AddressBookEntry = {
  address: string;
  name: string;
}

export type AddressBookProps = {
  addressBookList: AddressBookEntry[]
}


export type AddressBook = RecordOf<AddressBookProps>
