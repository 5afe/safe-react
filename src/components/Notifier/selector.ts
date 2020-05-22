import { createStructuredSelector } from 'reselect'

import { notificationsListSelector } from 'src/logic/notifications/store/selectors'

export default createStructuredSelector({
  notifications: notificationsListSelector,
})
