// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

import { type TxServiceType } from '~/logic/safe/transactions/txHistory'
import { type Owner, makeOwner } from '~/routes/safe/store/models/owner'

export type ConfirmationProps = {
  owner: Owner,
  type: TxServiceType,
  hash: string,
  signature?: string,
}

export const makeConfirmation: RecordFactory<ConfirmationProps> = Record({
  owner: makeOwner(),
  type: 'initialised',
  hash: '',
  signature: null,
})

export type Confirmation = RecordOf<ConfirmationProps>
