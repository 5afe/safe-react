// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type OwnerProps = {
  name: string,
  address: string,
}

export const makeOwner: RecordFactory<OwnerProps> = Record({
  name: '',
  address: '',
})

export type Owner = RecordOf<OwnerProps>

// Useage const someRecord: Owner = makeOwner({ name: ... })
