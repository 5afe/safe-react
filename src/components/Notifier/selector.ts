//
import { createStructuredSelector } from 'reselect'

import { notificationsListSelector } from 'logic/notifications/store/selectors'

export default createStructuredSelector({
  notifications: notificationsListSelector,
})
