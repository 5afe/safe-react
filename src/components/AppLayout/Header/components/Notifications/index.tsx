import { ReactElement, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Badge, ClickAwayListener, Paper, Popper } from '@material-ui/core'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import styled from 'styled-components'
import { orderBy } from 'lodash'

import { ReturnValue as Props } from 'src/logic/hooks/useStateHandler'
import {
  deleteAllNotifications,
  readNotification,
  selectNotifications,
} from 'src/logic/notifications/store/notifications'
import { black300, border, primary200, primary400, sm } from 'src/theme/variables'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import NotificationList from 'src/components/AppLayout/Header/components/Notifications/NotificationList'

export const NOTIFICATION_LIMIT = 4

// Props will be used in popper
const Notifications = ({ open, toggle, clickAway }: Props): ReactElement => {
  const dispatch = useDispatch()
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [showAll, setShowAll] = useState<boolean>(false)

  const notifications = useSelector(selectNotifications)
  const sortedNotifications = useMemo(() => orderBy(notifications, ['timestamp', 'read', 'action']), [notifications])

  const canExpand = notifications.length > NOTIFICATION_LIMIT

  const notificationsToShow =
    canExpand && showAll ? sortedNotifications : sortedNotifications.slice(0, NOTIFICATION_LIMIT)

  const unreadCount = useMemo(() => notifications.reduce((acc, { read }) => acc + Number(!read), 0), [notifications])
  const hasUnread = unreadCount > 0

  const handleClickBell = () => {
    if (open) {
      notificationsToShow.forEach(({ read, options }) => {
        if (read) return
        dispatch(readNotification({ key: options.key }))
      })
      setShowAll(false)
    }
    toggle()
  }

  const handleClickAway = () => {
    clickAway()
    setShowAll(false)
  }

  return (
    <>
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
      </Wrapper>
      <Popper
        anchorEl={notificationsRef.current}
        open={open}
        placement="bottom-start"
        style={{
          zIndex: 1302,
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseUp" touchEvent="onTouchEnd">
          <NotificationsPopper component="div">
            <NotificationsHeader>
              <div>
                <NotificationsTitle>Notifications</NotificationsTitle>
                {hasUnread && <UnreadCount>{unreadCount}</UnreadCount>}
              </div>
              <ClearAllButton onClick={() => dispatch(deleteAllNotifications())}>Clear All</ClearAllButton>
            </NotificationsHeader>
            <NotificationList notifications={notificationsToShow} />
            {canExpand && (
              <div>
                <ExpandIconButton onClick={() => setShowAll((prev) => !prev)} disableRipple>
                  {showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ExpandIconButton>
                <NotificationSubtitle>
                  {showAll ? 'Hide' : `${notifications.length - NOTIFICATION_LIMIT} other notifications`}
                </NotificationSubtitle>
              </div>
            )}
          </NotificationsPopper>
        </ClickAwayListener>
      </Popper>
    </>
  )
}

const Wrapper = styled.div`
  width: 44px;
  height: 100%;
  display: flex;
  justify-content: center;
`

const BellIconButton = styled(IconButton)`
  width: 100%;
  height: 100%;
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
  margin-top: 11px;
  width: 438px;
  padding: 30px 23px;
`

const NotificationsHeader = styled.div`
  height: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
`

const NotificationsTitle = styled.h4`
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
