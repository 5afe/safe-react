// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type ConfirmationProps = {
  owner: string,
  hash: string,
  signature?: string,
}

export const makeConfirmation: RecordFactory<ConfirmationProps> = Record({
  owner: '',
  hash: '',
  signature: null,
})

export type Confirmation = RecordOf<ConfirmationProps>
