import React from 'react'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { createAction } from 'redux-actions'
import { IconButton } from '@material-ui/core'
import { Close as IconClose } from '@material-ui/icons'
import { Notification } from 'src/logic/notifications/notificationTypes'
import closeSnackbarAction from './closeSnackbar'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { AppReduxState } from 'src/store'

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR'

const addSnackbar = createAction(ENQUEUE_SNACKBAR)

const enqueueSnackbar = (
  notification: Notification,
  key?: string | number,
  onClick?: () => void,
): ThunkAction<string | number, AppReduxState, undefined, AnyAction> => (dispatch: Dispatch) => {
  key = notification.key || new Date().getTime() + Math.random()

  const newNotification = {
    ...notification,
    key,
    options: {
      ...notification.options,
      onClick,
      // eslint-disable-next-line react/display-name
      action: (actionKey) => (
        <IconButton onClick={() => dispatch(closeSnackbarAction({ key: actionKey }))}>
          <IconClose />
        </IconButton>
      ),
    },
  }

  dispatch(addSnackbar(newNotification))

  return key
}

export default enqueueSnackbar
