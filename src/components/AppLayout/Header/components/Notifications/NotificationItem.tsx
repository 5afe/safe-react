import { ReactElement } from 'react'
import styled from 'styled-components'
import { OptionsObject } from 'notistack'
import { ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'

import { NotificationsState } from 'src/logic/notifications/store/notifications'
import { black500, background, black300, primaryLite } from 'src/theme/variables'
import { formatTime } from 'src/utils/date'
import AlertIcon from 'src/assets/icons/alert.svg'
import CheckIcon from 'src/assets/icons/check.svg'
import ErrorIcon from 'src/assets/icons/error.svg'
import InfoIcon from 'src/assets/icons/info.svg'
import { UnreadNotificationBadge } from 'src/components/AppLayout/Header/components/Notifications'
import NotificationLink from './NotificationLink'

const notificationIcon = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertIcon,
}

const getNotificationIcon = (variant: OptionsObject['variant'] = 'info'): string => notificationIcon[variant]

const NoficationItem = ({
  read,
  options,
  message,
  timestamp,
  link,
  handleClickAway,
}: NotificationsState[number] & { handleClickAway: () => void }): ReactElement => {
  const secondaryText = (
    <SecondaryText>
      <span>{formatTime(timestamp)}</span>
      {link && <NotificationLink onClick={handleClickAway} {...link} />}
    </SecondaryText>
  )
  return (
    /*
  //@ts-expect-error requires child to be button when using styled-components */
    <NotificationListItem $requiresAction={!read && !!link}>
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
      <ListItemText primary={<NotificationMessage>{message}</NotificationMessage>} secondary={secondaryText} />
    </NotificationListItem>
  )
}

const NotificationListItem = styled(ListItem)<{ $requiresAction: boolean }>`
  &.MuiListItem-root {
    background-color: ${({ $requiresAction }) => ($requiresAction ? primaryLite : undefined)};
    padding: 8px 24px;
    position: relative;
  }
  &.MuiListItem-root:not(:last-child):after {
    content: '';
    background: ${background};
    position: absolute;
    bottom: 0;
    left: 24px;
    height: 2px;
    width: calc(100% - 48px);
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

const SecondaryText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${black300};
`

export default NoficationItem
