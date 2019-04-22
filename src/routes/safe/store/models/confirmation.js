// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { makeOwner, type Owner } from '~/routes/safe/store/models/owner'
import { type TxServiceType } from '~/logic/safe/safeTxHistory'

export type ConfirmationProps = {
  owner: Owner,
  type: TxServiceType,
  hash: string,
}

export const makeConfirmation: RecordFactory<ConfirmationProps> = Record({
  owner: makeOwner(),
  type: 'initialised',
  hash: '',
})

export type Confirmation = RecordOf<ConfirmationProps>
