// @flow
import type { RecordFactory, RecordOf } from 'immutable'
import { Record } from 'immutable'

export type AddressBookEntryType = {
  address: string;
  name: string;
}

export type AddressBookProps = {
  addressBookList: AddressBookEntryType[]
}

export const makeEntry: RecordFactory<AddressBookEntryType> = Record({
  name: '',
  address: '',
})

export type AddressBook = RecordOf<AddressBookProps>
