// 
import { Record } from 'immutable'

import { } from 'src/logic/safe/transactions/txHistory'
import { makeOwner } from 'src/routes/safe/store/models/owner'


export const makeConfirmation = Record({
  owner: makeOwner(),
  type: 'initialised',
  hash: '',
  signature: null,
})

