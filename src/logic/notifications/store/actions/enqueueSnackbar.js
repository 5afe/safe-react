// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'

import { type NotificationProps } from '~/logic/notifications/store/models/notification'
import { type GlobalState } from '~/store'

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR'

const addSnackbar = createAction<string, *>(ENQUEUE_SNACKBAR)

const enqueueSnackbar = (notification: NotificationProps) => (dispatch: ReduxDispatch<GlobalState>) => {
  const newNotification = {
    ...notification,
    key: notification.key || new Date().getTime(),
  }
  dispatch(addSnackbar(newNotification))
}

export default enqueueSnackbar
