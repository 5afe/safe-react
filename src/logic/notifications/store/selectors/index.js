// @flow
import { List, Map } from 'immutable'
import { type Selector, createSelector } from 'reselect'

import { type Notification } from '~/logic/notifications/store/models/notification'
import { NOTIFICATIONS_REDUCER_ID } from '~/logic/notifications/store/reducer/notifications'
import { type GlobalState } from '~/store'

const notificationsMapSelector = (state: GlobalState): Map<string, Notification> => state[NOTIFICATIONS_REDUCER_ID]

export const notificationsListSelector: Selector<
  GlobalState,
  {},
  List<Notification>,
> = createSelector(notificationsMapSelector, (notifications: Map<string, Notification>): List<Notification> =>
  notifications.toList(),
)
