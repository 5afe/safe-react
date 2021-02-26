import { Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { Notification } from 'src/logic/notifications/notificationTypes'
import { AppReduxState } from 'src/store'
import { CLOSE_SNACKBAR } from '../actions/closeSnackbar'
import { ENQUEUE_SNACKBAR } from '../actions/enqueueSnackbar'
import { REMOVE_SNACKBAR } from '../actions/removeSnackbar'

export const NOTIFICATIONS_REDUCER_ID = 'notifications'

type CloseSnackBarPayload = { key: string; dismissAll: boolean }
type Payloads = Notification | CloseSnackBarPayload | string

export default handleActions<AppReduxState['notifications'], Payloads>(
  {
    [ENQUEUE_SNACKBAR]: (state, action: Action<Notification>) => {
      const notification = action.payload

      if (!notification.key) {
        return state
      }

      return state.set(notification.key, notification)
    },
    [CLOSE_SNACKBAR]: (state, action: Action<CloseSnackBarPayload>) => {
      const { dismissAll, key } = action.payload

      if (key && state.get(key)) {
        return state.update(key, (notification) => {
          if (notification) {
            return {
              ...notification,
              dismissed: true,
            }
          }

          return notification
        })
      }

      if (dismissAll) {
        return state.withMutations((map) => {
          map.forEach((notification, notificationKey) => {
            map.set(notificationKey, { ...notification, dismissed: true })
          })
        })
      }

      return state
    },
    [REMOVE_SNACKBAR]: (state, action: Action<string>) => {
      const key = action.payload

      return state.delete(key)
    },
  },
  Map(),
)
