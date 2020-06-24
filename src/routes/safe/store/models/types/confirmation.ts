import { RecordOf } from 'immutable'

export type ConfirmationProps = {
  owner: string
  type: string
  hash: string
  signature: string | null
}

export type Confirmation = RecordOf<ConfirmationProps>
