import { ReactElement } from 'react'
import styled from 'styled-components'
import { OptionsObject } from 'notistack'
import { ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'

import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { black500, background, black300 } from 'src/theme/variables'
import { formatTime } from 'src/utils/date'
import AlertIcon from 'src/assets/icons/alert.svg'
import CheckIcon from 'src/assets/icons/check.svg'
import ErrorIcon from 'src/assets/icons/error.svg'
import InfoIcon from 'src/assets/icons/info.svg'
import { UnreadNotificationBadge } from 'src/components/AppLayout/Header/components/Notifications'

const notificationIcon = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertIcon,
}

const getNotificationIcon = (variant: OptionsObject['variant'] = 'info'): string => notificationIcon[variant]

const NoficationItem = ({ read, options, message, timestamp }: NotificationsState[number]): ReactElement => (
  /*
  //@ts-expect-error requires child to be button when using styled-components */
  <NotificationListItem>
    <ListItemAvatar>
      <UnreadNotificationBadge
        variant="dot"
        overlap="circle"
        invisible={read}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <img src={getNotificationIcon(options?.variant)} alt="Notification" />
      </UnreadNotificationBadge>
    </ListItemAvatar>
    <ListItemText primary={<NotificationMessage>{message}</NotificationMessage>} secondary={formatTime(timestamp)} />
  </NotificationListItem>
)

const NotificationListItem = styled(ListItem)`
  &.MuiListItem-root:not(:last-child) {
    border-bottom: 2px solid ${background};
  }
  .MuiListItemText-secondary {
    color: ${black300};
  }
  .MuiListItemAvatar-root {
    min-width: 42px;
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
