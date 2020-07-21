import { AddressBookEntryRecord, AddressBookEntryProps } from 'src/logic/addressBook/model/addressBook'
import { Map, List } from 'immutable'

export interface AddressBookReducerState {
  addressBook: AddressBookMap
}

interface AddressBookMapSerialized {
  [key: string]: AddressBookEntryProps
}

interface AddressBookReducerStateSerialized extends AddressBookReducerState {
  addressBook: Record<string, AddressBookEntryProps[]>
}

export interface AddressBookMap extends Map<string> {
  toJS(): AddressBookMapSerialized
  get(key: string): List<AddressBookEntryRecord>
}

export interface AddressBookReducerMap extends Map<string, any> {
  toJS(): AddressBookReducerStateSerialized
  get<K extends keyof AddressBookReducerState>(key: K): AddressBookReducerState[K]
}
