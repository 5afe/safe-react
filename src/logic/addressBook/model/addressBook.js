// @flow
import type { RecordOf } from 'immutable'

export type AddressBookType = {
  address: string;
  name: string;
}

export type AddressBookProps = {
  addressBookList: AddressBookType[]
}

export type AddressBook = RecordOf<AddressBookProps>
