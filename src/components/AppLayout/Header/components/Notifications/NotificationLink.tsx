import { ReactElement, useMemo, CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { primaryActive } from 'src/theme/variables'
import { Notification } from 'src/logic/notifications/notificationTypes'

type NotificationLinkProps = {
  onClick: () => void
} & Notification['link']

const NotificationLink = ({ title, ...rest }: NotificationLinkProps): ReactElement => {
  const style = useMemo<CSSProperties>(
    () => ({
      all: 'unset',
      cursor: 'pointer',
      color: primaryActive,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
    }),
    [],
  )

  return (
    <Link {...rest} style={style}>
      {title} <ChevronRightIcon />
    </Link>
  )
}

export default NotificationLink
