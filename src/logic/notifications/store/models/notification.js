// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type NotificationProps = {
  message: string,
  options: Object,
  dismissed: boolean,
}

export const makeNotification: RecordFactory<NotificationProps> = Record({
  message: '',
  options: {},
  dismissed: false,
})

export type Notification = RecordOf<NotificationProps>
