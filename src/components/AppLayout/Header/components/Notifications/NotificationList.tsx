import { ReactElement } from 'react'
import styled from 'styled-components'

import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { NOTIFICATION_LIMIT } from 'src/components/AppLayout/Header/components/Notifications'
import { StyledScrollableBar } from 'src/routes/safe/components/Transactions/TxList/styled'
import { black300 } from 'src/theme/variables'
import NotificationItem from 'src/components/AppLayout/Header/components/Notifications/NotificationItem'

const NotificationList = ({ notifications }: { notifications: NotificationsState }): ReactElement => {
  if (!notifications.length) {
    return <NotificationType>No notifications</NotificationType>
  }

  return (
    <ScrollContainer $showScrollbar={notifications.length > NOTIFICATION_LIMIT}>
      <NotificationType>System updates</NotificationType>
      {notifications.map((notification) => (
        <NotificationItem key={notification.timestamp} {...notification} />
      ))}
    </ScrollContainer>
  )
}

const ScrollContainer = styled(StyledScrollableBar)<{ $showScrollbar: boolean }>`
  height: ${({ $showScrollbar: $scroll }) => ($scroll ? '500px' : 'auto')};
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
`

const NotificationType = styled.h4`
  all: unset;
  display: block;
  font-weight: 400;
  font-size: 14px;
  color: ${black300};
  margin-bottom: 12px;
`

export default NotificationList
