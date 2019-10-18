// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type NotificationProps = {
  key?: number,
  message: string,
  options: Object,
  dismissed: boolean,
}

export const makeNotification: RecordFactory<NotificationProps> = Record({
  key: 0,
  message: '',
  options: {},
  dismissed: false,
})

export type Notification = RecordOf<NotificationProps>
