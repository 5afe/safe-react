// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

import { type TxServiceType } from '~/logic/safe/transactions/txHistory'

export type ConfirmationProps = {
  owner: string,
  type: TxServiceType,
  hash: string,
  signature?: string,
}

export const makeConfirmation: RecordFactory<ConfirmationProps> = Record({
  owner: '',
  type: 'initialised',
  hash: '',
  signature: null,
})

export type Confirmation = RecordOf<ConfirmationProps>
