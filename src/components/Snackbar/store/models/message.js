// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type Variant = 'success' | 'error' | 'warning' | 'info'

export type MessageProps = {
  content: string,
  variant: Variant,
  key?: number,
}

export const makeMessage: RecordFactory<MessageProps> = Record({
  content: '',
  variant: '',
  key: '',
})

export type Message = RecordOf<MessageProps>
