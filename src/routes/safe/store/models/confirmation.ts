import { Record } from 'immutable'

export const makeConfirmation = Record({
  owner: '',
  type: 'initialised',
  hash: '',
  signature: null,
})
