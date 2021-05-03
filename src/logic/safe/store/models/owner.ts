import { Record } from 'immutable'

export const makeOwner = Record({
  name: 'UNKNOWN',
  address: '',
})

// Usage const someRecord: Owner = makeOwner({ name: ... })
