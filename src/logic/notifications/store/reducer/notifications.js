// @flow
import { Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { CLOSE_SNACKBAR } from '../actions/closeSnackbar'
import { ENQUEUE_SNACKBAR } from '../actions/enqueueSnackbar'
import { REMOVE_SNACKBAR } from '../actions/removeSnackbar'

import { type NotificationProps, makeNotification } from '~/logic/notifications/store/models/notification'

export const NOTIFICATIONS_REDUCER_ID = 'notifications'

export type NotificationReducerState = Map<string, *>

export default handleActions<NotificationReducerState, *>(
  {
    [ENQUEUE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const notification: NotificationProps = action.payload

      return state.set(notification.key, makeNotification(notification))
    },
    [CLOSE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const { dismissAll, key } = action.payload

      if (key) {
        return state.update(key, prev => prev.set('dismissed', true))
      }
      if (dismissAll) {
        return state.withMutations(map => {
          map.forEach((notification, notificationKey) => {
            map.set(notificationKey, notification.set('dismissed', true))
          })
        })
      }

      return state
    },
    [REMOVE_SNACKBAR]: (state: NotificationReducerState, action: ActionType<Function>): NotificationReducerState => {
      const key = action.payload

      return state.delete(key)
    },
  },
  Map(),
)
