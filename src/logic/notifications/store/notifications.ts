import { OptionsObject, SnackbarKey } from 'notistack'
import { AnyAction } from 'redux'
import { Action, createAction, handleActions } from 'redux-actions'
import { ThunkAction } from 'redux-thunk'

import { Notification } from 'src/logic/notifications/notificationTypes'
import { AppReduxState } from 'src/store'

export const NOTIFICATIONS_REDUCER_ID = 'notifications'

enum NOTIFICATION_ACTIONS {
  SHOW = 'notifications/show',
  READ = 'notifications/read',
  CLOSE = 'notifications/close',
  CLOSE_ALL = 'notifications/closeAll',
  DELETE = 'notifications/delete',
  DELETE_ALL = 'notifications/deleteAll',
}

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

// `showNotification` generates `options.key` if none is provided
type KeyedNotification = Notification & { options: WithRequiredProperty<OptionsObject, 'key'> }

export type NotificationsState = (KeyedNotification & {
  timestamp: number
  dismissed: boolean
  read: boolean
})[]

type ShowPayload = KeyedNotification
type KeyPayload = { key: SnackbarKey }
type ClosePayload = KeyPayload & { read?: boolean }

type Payloads = ShowPayload | ClosePayload | KeyPayload

const notificationsReducer = handleActions<NotificationsState, Payloads>(
  {
    [NOTIFICATION_ACTIONS.SHOW]: (state, { payload }: Action<ShowPayload>) => {
      return [...state, { ...payload, read: false, dismissed: false, timestamp: new Date().getTime() }]
    },
    [NOTIFICATION_ACTIONS.READ]: (state, action: Action<KeyPayload>) => {
      return state.map((notification) => {
        return notification.options?.key === action.payload.key ? { ...notification, read: true } : notification
      })
    },
    [NOTIFICATION_ACTIONS.CLOSE]: (state, action: Action<ClosePayload>) => {
      return state.map((notification) => {
        return notification.options?.key === action.payload.key ? { ...notification, dismissed: true } : notification
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
  payload: Notification,
): ThunkAction<SnackbarKey, AppReduxState, undefined, AnyAction> => {
  return (dispatch): SnackbarKey => {
    const action = createAction<KeyedNotification>(NOTIFICATION_ACTIONS.SHOW)

    // Generate/append random key in case key was dispatched before and is `read`
    const key = `${payload.options?.key || ''}${Math.random().toString(32).slice(2)}`

    dispatch(action({ ...payload, options: { ...payload.options, key } }))

    return key
  }
}
export const readNotification = createAction<KeyPayload>(NOTIFICATION_ACTIONS.READ)
export const closeNotification = (payload: ClosePayload): ThunkAction<void, AppReduxState, undefined, AnyAction> => {
  return (dispatch): void => {
    const { read = true } = payload
    if (read) {
      dispatch(readNotification(payload))
    }

    const action = createAction<ClosePayload>(NOTIFICATION_ACTIONS.CLOSE)
    dispatch(action(payload))
  }
}
export const closeAllNotifications = createAction(NOTIFICATION_ACTIONS.CLOSE_ALL)
export const deleteNotification = createAction<KeyPayload>(NOTIFICATION_ACTIONS.DELETE)
export const deleteAllNotifications = createAction(NOTIFICATION_ACTIONS.DELETE_ALL)

export const selectNotifications = (state: AppReduxState): NotificationsState => {
  return state[NOTIFICATIONS_REDUCER_ID]
}

export default notificationsReducer
