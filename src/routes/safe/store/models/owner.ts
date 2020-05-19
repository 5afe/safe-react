import { Record } from 'immutable'

export const makeOwner = Record({
  name: '',
  address: '',
})

// Useage const someRecord: Owner = makeOwner({ name: ... })
