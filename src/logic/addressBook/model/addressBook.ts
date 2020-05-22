import { Record } from 'immutable'

export const makeAddressBookEntry = Record({
  address: '',
  name: '',
  isOwner: false,
})
