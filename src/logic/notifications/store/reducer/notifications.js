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
      const notification: NotificationProps = action.payload

      return state.set(notification.key, makeNotification(notification))
    },
    [CLOSE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const key = action.payload

      return state.update(key, (prev) => prev.set('dismissed', true))
    },
    [REMOVE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const key = action.payload

      return state.delete(key)
    },
  },
  Map(),
)
