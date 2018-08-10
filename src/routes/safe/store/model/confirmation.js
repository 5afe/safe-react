// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'
import { makeOwner, type Owner } from '~/routes/safe/store/model/owner'
import { type TxServiceType } from '~/wallets/safeTxHistory'

export type ConfirmationProps = {
  owner: Owner,
  type: TxServiceType,
  hash: string,
}

export const makeConfirmation: RecordFactory<ConfirmationProps> = Record({
  owner: makeOwner(),
  type: 'confirmation',
  hash: '',
})

export type Confirmation = RecordOf<ConfirmationProps>
