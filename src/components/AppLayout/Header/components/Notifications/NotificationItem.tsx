import styled from 'styled-components'
import { OptionsObject } from 'notistack'

import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { black500 } from 'src/theme/variables'
import { formatTime } from 'src/utils/date'
import AlertIcon from 'src/assets/icons/alert.svg'
import CheckIcon from 'src/assets/icons/check.svg'
import ErrorIcon from 'src/assets/icons/error.svg'
import InfoIcon from 'src/assets/icons/info.svg'
import { UnreadNotificationBadge, NotificationSubtitle } from 'src/components/AppLayout/Header/components/Notifications'

const notificationIcon = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertIcon,
}

const getNotificationIcon = (variant: OptionsObject['variant'] = 'info'): string => notificationIcon[variant]

const NoficationItem = ({ read, options, message, timestamp }: NotificationsState[number]) => (
  <Notification>
    <UnreadNotificationBadge
      variant="dot"
      overlap="circle"
      invisible={read}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <img src={getNotificationIcon(options?.variant)} />
    </UnreadNotificationBadge>
    <div>
      <NotificationMessage>{message}</NotificationMessage>
      <br />
      <NotificationSubtitle>{formatTime(timestamp)}</NotificationSubtitle>
    </div>
  </Notification>
)

const Notification = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  > * {
    padding: 8px;
  }
`

const NotificationMessage = styled.p`
  all: unset;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${black500};
`

export default NoficationItem
