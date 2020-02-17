// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store'
import { NOTIFICATIONS_REDUCER_ID } from '~/logic/notifications/store/reducer/notifications'
import { type Notification } from '~/logic/notifications/store/models/notification'

const notificationsMapSelector = (state: GlobalState): Map<string, Notification> => state[NOTIFICATIONS_REDUCER_ID]

export const notificationsListSelector: Selector<
  GlobalState,
  {},
  List<Notification>,
> = createSelector(notificationsMapSelector, (notifications: Map<string, Notification>): List<Notification> =>
  notifications.toList(),
)
