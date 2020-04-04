// 
import { Record } from 'immutable'

import { } from '~/logic/safe/transactions/txHistory'
import { makeOwner } from '~/routes/safe/store/models/owner'


export const makeConfirmation = Record({
  owner: makeOwner(),
  type: 'initialised',
  hash: '',
  signature: null,
})

