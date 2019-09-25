// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { makeNotification, type NotificationProps } from '~/logic/notifications/store/models/notification'
import { ENQUEUE_SNACKBAR } from '../actions/enqueueSnackbar'
import { CLOSE_SNACKBAR } from '../actions/closeSnackbar'
import { REMOVE_SNACKBAR } from '../actions/removeSnackbar'

export const NOTIFICATIONS_REDUCER_ID = 'notifications'

export type NotificationReducerState = Map<string, *>

export default handleActions<NotificationReducerState, *>(
  {
    [ENQUEUE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const { notification }: { notification: NotificationProps } = action.payload

      if (state.hasIn(['notifications', notification.options.key])) {
        return state.updateIn(['notifications', notification.options.key], (prev) => prev.merge(notification))
      }
      return state.setIn(['notifications', notification.options.key], makeNotification(notification))
    },
    [CLOSE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const { notification }: { notification: NotificationProps } = action.payload
      notification.dismissed = true

      return state.updateIn(['notifications', notification.key], (prev) => prev.merge(notification))
    },
    [REMOVE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const key = action.payload

      return state.deleteIn(['notification', key])
    },
  },
  Map({
    notifications: Map(),
  }),
)
