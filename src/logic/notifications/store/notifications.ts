import { SnackbarKey } from 'notistack'
import { AnyAction } from 'redux'
import { Action, createAction, handleActions } from 'redux-actions'
import { ThunkAction } from 'redux-thunk'

import { Notification } from 'src/logic/notifications/notificationTypes'
import { AppReduxState } from 'src/store'

export const NOTIFICATIONS_REDUCER_ID = 'notifications'

enum NOTIFICATION_ACTIONS {
  SHOW = 'notifications/show',
  CLOSE = 'notifications/close',
  CLOSE_ALL = 'notifications/closeAll',
  DELETE = 'notifications/delete',
  DELETE_ALL = 'notifications/deleteAll',
}

export type NotificationsState = Notification[]

type KeyPayload = { key: SnackbarKey }

const notificationsReducer = handleActions<NotificationsState, Notification | KeyPayload>(
  {
    [NOTIFICATION_ACTIONS.SHOW]: (state, { payload }: Action<Notification>) => {
      // getNotificationsFromTxType can return `null` notifications
      return payload ? [...state, payload] : state
    },
    [NOTIFICATION_ACTIONS.CLOSE]: (state, { payload }: Action<KeyPayload>) => {
      return state.map((notification) => {
        return notification.options?.key === payload.key ? { ...notification, dismissed: true } : notification
      })
    },
    [NOTIFICATION_ACTIONS.CLOSE_ALL]: (state) => {
      return state.map((notification) => ({ ...notification, dismissed: true }))
    },
    [NOTIFICATION_ACTIONS.DELETE]: (state, { payload }: Action<KeyPayload>) => {
      return state.filter((notification) => notification.options?.key !== payload.key)
    },
    [NOTIFICATION_ACTIONS.DELETE_ALL]: () => {
      return []
    },
  },
  [],
)

export const showNotification = (
  payload: Pick<Notification, 'message' | 'options'>,
): ThunkAction<SnackbarKey, AppReduxState, undefined, AnyAction> => {
  return (dispatch): SnackbarKey => {
    const action = createAction<Notification>(NOTIFICATION_ACTIONS.SHOW)

    const key = payload.options?.key || Math.random().toString(32).slice(2)

    dispatch(
      action({
        ...payload,
        options: { ...payload.options, key },
      }),
    )

    return key
  }
}
export const closeNotification = createAction<KeyPayload>(NOTIFICATION_ACTIONS.CLOSE)
export const closeAllNotifications = createAction(NOTIFICATION_ACTIONS.CLOSE_ALL)
export const deleteNotification = createAction<KeyPayload>(NOTIFICATION_ACTIONS.DELETE)
export const deleteAllNotifications = createAction(NOTIFICATION_ACTIONS.DELETE_ALL)

export const selectNotifications = (state: AppReduxState): NotificationsState => {
  return state[NOTIFICATIONS_REDUCER_ID]
}

export default notificationsReducer
