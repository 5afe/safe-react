import { ReactElement, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { IconButton, Badge } from '@material-ui/core'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import styled from 'styled-components'

import { ReturnValue as Props } from 'src/logic/hooks/useStateHandler'
import { selectNotifications } from 'src/logic/notifications/store/notifications'
import { primary400 } from 'src/theme/variables'

const Wrapper = styled.div`
  width: 44px;
  display: flex;
  justify-content: center;
`

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: ${primary400};
  }
`

// Props will be used in popper
const Notifications = ({}: Props): ReactElement => {
  const notifications = useSelector(selectNotifications)

  const hasUnread = useMemo(() => notifications.some(({ read }) => !read), [notifications])

  return (
    <Wrapper>
      <IconButton>
        <StyledBadge
          variant="dot"
          color="primary"
          invisible={!hasUnread}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <NotificationsNoneIcon />
        </StyledBadge>
      </IconButton>
    </Wrapper>
  )
}

export default Notifications
