import { createSelector } from 'reselect'
import { NOTIFICATIONS_REDUCER_ID } from 'src/logic/notifications/store/reducer/notifications'

const notificationsMapSelector = (state) => state[NOTIFICATIONS_REDUCER_ID]

export const notificationsListSelector = createSelector(notificationsMapSelector, (notifications) =>
  notifications.toList(),
)
