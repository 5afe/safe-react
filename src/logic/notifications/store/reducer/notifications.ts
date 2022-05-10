import { Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { Notification } from 'src/logic/notifications/notificationTypes'
import { CLOSE_SNACKBAR } from '../actions/closeSnackbar'
import { ENQUEUE_SNACKBAR } from '../actions/enqueueSnackbar'
import { REMOVE_SNACKBAR } from '../actions/removeSnackbar'

export const NOTIFICATIONS_REDUCER_ID = 'notifications'

type NotificationsState = Map<string, Notification>

type CloseSnackBarPayload = { key: string; dismissAll: boolean }
type Payloads = Notification | CloseSnackBarPayload | string

const notificationsReducer = handleActions<NotificationsState, Payloads>(
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
        return state.update(key, (notification: Notification) => {
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
  Map<string, Notification>(),
)

export default notificationsReducer
