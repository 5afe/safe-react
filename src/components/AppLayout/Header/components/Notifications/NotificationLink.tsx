import { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { primaryActive } from 'src/theme/variables'
import { Notification } from 'src/logic/notifications/notificationTypes'
import styled from 'styled-components'

type NotificationLinkProps = {
  onClick: () => void
} & Notification['link']

const NotificationLink = ({ title, ...rest }: NotificationLinkProps): ReactElement => (
  <StyledLink {...rest}>
    {title} <ChevronRightIcon />
  </StyledLink>
)

const StyledLink = styled(Link)`
  all: unset;
  cursor: pointer;
  color: ${primaryActive};
  font-weight: 700;
  display: flex;
  align-items: center;
`

export default NotificationLink
