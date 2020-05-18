// 
import { createAction } from 'redux-actions'

import { } from 'logic/notifications/store/models/notification'
import { } from 'store'

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR'

const addSnackbar = createAction(ENQUEUE_SNACKBAR)

const enqueueSnackbar = (notification) => (dispatch) => {
  const newNotification = {
    ...notification,
    key: notification.key || new Date().getTime(),
  }
  dispatch(addSnackbar(newNotification))
}

export default enqueueSnackbar
