// 
import { Record } from 'immutable'

import { } from 'logic/safe/transactions/txHistory'


export const makeConfirmation = Record({
  owner: '',
  type: 'initialised',
  hash: '',
  signature: null,
})

