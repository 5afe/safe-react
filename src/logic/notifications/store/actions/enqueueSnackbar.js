// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import { type NotificationProps } from '~/logic/notifications/store/models/notification'

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR'

const addSnackbar = createAction<string, *>(ENQUEUE_SNACKBAR)

const enqueueSnackbar = (notification: NotificationProps) => (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  const newNotification = {
    ...notification,
    key: new Date().getTime(),
  }

  dispatch(addSnackbar(newNotification))
}

export default enqueueSnackbar
