//
import { Record } from 'immutable'

import {} from 'src/logic/safe/transactions/txHistory'

export const makeConfirmation = Record({
  owner: '',
  type: 'initialised',
  hash: '',
  signature: null,
})
