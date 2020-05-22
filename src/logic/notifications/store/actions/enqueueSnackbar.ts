import { createAction } from 'redux-actions'

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
