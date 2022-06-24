import { ReactElement, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Badge, ClickAwayListener, Paper, Popper } from '@material-ui/core'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import styled from 'styled-components'

import { ReturnValue as Props } from 'src/logic/hooks/useStateHandler'
import {
  deleteAllNotifications,
  NotificationsState,
  readNotification,
  selectNotifications,
} from 'src/logic/notifications/store/notifications'
import { background, black300, border, primary200, primary400, sm } from 'src/theme/variables'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import NotificationList from 'src/components/AppLayout/Header/components/Notifications/NotificationList'

export const NOTIFICATION_LIMIT = 4

export const getSortedNotifications = (notifications: NotificationsState): NotificationsState => {
  const chronologicalNotifications = notifications.sort((a, b) => b.timestamp - a.timestamp)

  const unreadActionNotifications = chronologicalNotifications.filter(({ read, action }) => !read && action)
  const unreadNotifications = chronologicalNotifications.filter(({ read, action }) => !read && !action)
  const readNotifications = chronologicalNotifications.filter(({ read }) => read)

  return [...unreadActionNotifications, ...unreadNotifications, ...readNotifications]
}

const Notifications = ({ open, toggle, clickAway }: Props): ReactElement => {
  const dispatch = useDispatch()
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [showAll, setShowAll] = useState<boolean>(false)

  const notifications = useSelector(selectNotifications)
  const hasNotifications = notifications.length > 0

  const sortedNotifications = useMemo(() => getSortedNotifications(notifications), [notifications])

  const canExpand = notifications.length > NOTIFICATION_LIMIT

  const notificationsToShow =
    canExpand && showAll ? sortedNotifications : sortedNotifications.slice(0, NOTIFICATION_LIMIT)

  const unreadCount = useMemo(
    () => notifications.filter(({ read, dismissed }) => !read && dismissed).length,
    [notifications],
  )
  const hasUnread = unreadCount > 0

  const handleRead = () => {
    if (!open) {
      return
    }
    notificationsToShow.forEach(({ read, options }) => {
      if (read) return
      dispatch(readNotification({ key: options.key }))
    })
    setShowAll(false)
  }

  const handleClickBell = () => {
    handleRead()
    toggle()
  }

  const handleClickAway = () => {
    handleRead()
    clickAway()
  }

  const handleClear = () => {
    if (hasNotifications) {
      dispatch(deleteAllNotifications())
    }
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseUp" touchEvent="onTouchEnd">
      <Wrapper ref={notificationsRef}>
        <BellIconButton onClick={handleClickBell} disableRipple>
          <UnreadNotificationBadge
            variant="dot"
            invisible={!hasUnread}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <NotificationsNoneIcon fontSize="small" />
          </UnreadNotificationBadge>
        </BellIconButton>
        <Popper
          anchorEl={notificationsRef.current}
          open={open}
          placement="bottom-start"
          style={{
            zIndex: 1302,
          }}
          popperOptions={{ positionFixed: true }}
          modifiers={{
            offset: {
              enabled: true,
              offset: '0, 11px',
            },
          }}
        >
          <NotificationsPopper component="div">
            <NotificationsHeader>
              <div>
                <NotificationsTitle>Notifications</NotificationsTitle>
                {hasUnread && <UnreadCount>{unreadCount}</UnreadCount>}
              </div>
              {hasNotifications && <ClearAllButton onClick={handleClear}>Clear All</ClearAllButton>}
            </NotificationsHeader>
            <NotificationList notifications={notificationsToShow} />
            {canExpand && (
              <NotificationsFooter>
                <ExpandIconButton onClick={() => setShowAll((prev) => !prev)} disableRipple>
                  {showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ExpandIconButton>
                <NotificationSubtitle>
                  {showAll ? 'Hide' : `${notifications.length - NOTIFICATION_LIMIT} other notifications`}
                </NotificationSubtitle>
              </NotificationsFooter>
            )}
          </NotificationsPopper>
        </Popper>
      </Wrapper>
    </ClickAwayListener>
  )
}

const Wrapper = styled.div`
  height: 100%;
`

const BellIconButton = styled(IconButton)`
  width: 44px;
  height: 100%;
  border-radius: 0;
  &:hover {
    background: none;
  }
`

export const UnreadNotificationBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: ${primary400};
  }
`

const NotificationsPopper = styled(Paper)`
  box-sizing: border-box;
  border-radius: ${sm};
  box-shadow: 0 0 10px 0 rgba(33, 48, 77, 0.1);
  width: 438px;
`

const NotificationsHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 24px 24px;
  border-bottom: 2px solid ${background};
`

const NotificationsTitle = styled.h4`
  all: unset;
  display: inline;
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
`

const UnreadCount = styled.span`
  display: inline-block;
  background: ${primary200};
  border-radius: 6px;
  margin-left: 9px;
  color: ${primary400};
  text-align: center;
  width: 18px;
  height: 18px;
`

const ClearAllButton = styled.button`
  all: unset;
  cursor: pointer;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  color: ${primary400};
  :hover {
    color: #005546; // Same as MUI Button
  }
`

const NotificationsFooter = styled.div`
  padding: 24px 32px 16px;
`

export const NotificationSubtitle = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${black300};
`

const ExpandIconButton = styled(IconButton)`
  box-sizing: border-box;
  background-color: ${border};
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 18px;
  padding: 0;
  > * {
    color: ${black300};
  }
`

export default Notifications
