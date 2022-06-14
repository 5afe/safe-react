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

export type NotificationsState = (Notification & {
  timestamp: number
  dismissed: boolean
  read: boolean
})[]

type ShowPayload = Notification
type ClosePayload = { key: SnackbarKey; read?: boolean }
type DeletePayload = { key: SnackbarKey }

type Payloads = ShowPayload | ClosePayload | DeletePayload

const notificationsReducer = handleActions<NotificationsState, Payloads>(
  {
    [NOTIFICATION_ACTIONS.SHOW]: (state, { payload }: Action<ShowPayload>) => {
      return [...state, { ...payload, read: false, dismissed: false, timestamp: new Date().getTime() }]
    },
    [NOTIFICATION_ACTIONS.CLOSE]: (state, action: Action<ClosePayload>) => {
      const { key, read = true } = action.payload

      return state.map((notification) => {
        return notification.options?.key === key ? { ...notification, read, dismissed: true } : notification
      })
    },
    [NOTIFICATION_ACTIONS.CLOSE_ALL]: (state) => {
      return state.map((notification) => ({ ...notification, dismissed: true }))
    },
    [NOTIFICATION_ACTIONS.DELETE]: (state, { payload }: Action<DeletePayload>) => {
      return state.filter((notification) => notification.options?.key !== payload.key)
    },
    [NOTIFICATION_ACTIONS.DELETE_ALL]: () => {
      return []
    },
  },
  [],
)

export const showNotification = (
  payload: ShowPayload,
): ThunkAction<SnackbarKey, AppReduxState, undefined, AnyAction> => {
  return (dispatch): SnackbarKey => {
    const action = createAction<ShowPayload>(NOTIFICATION_ACTIONS.SHOW)

    const key = payload.options?.key || Math.random().toString(32).slice(2)

    dispatch(action({ ...payload, options: { ...payload.options, key } }))

    return key
  }
}
export const closeNotification = createAction<ClosePayload>(NOTIFICATION_ACTIONS.CLOSE)
export const closeAllNotifications = createAction(NOTIFICATION_ACTIONS.CLOSE_ALL)
export const deleteNotification = createAction<DeletePayload>(NOTIFICATION_ACTIONS.DELETE)
export const deleteAllNotifications = createAction(NOTIFICATION_ACTIONS.DELETE_ALL)

export const selectNotifications = (state: AppReduxState): NotificationsState => {
  return state[NOTIFICATIONS_REDUCER_ID]
}

export default notificationsReducer
