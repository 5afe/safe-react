import { Record } from 'immutable'

export const makeNotification = Record({
  key: 0,
  message: '',
  options: {},
  dismissed: false,
})
