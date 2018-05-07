// @flow
import * as React from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import NotificationsPaused from 'material-ui-icons/NotificationsPaused'
import Button from '~/components/layout/Button'
import ListItemText from '~/components/List/ListItemText'

type Props = {
  limit: number,
  onWithdrawn: () => void,
}

const DailyLimit = ({ limit, onWithdrawn }: Props) => (
  <ListItem>
    <Avatar>
      <NotificationsPaused />
    </Avatar>
    <ListItemText primary="Daily Limit" secondary={`${limit} ETH`} />
    <Button
      variant="raised"
      color="primary"
      onClick={onWithdrawn}
    >
      Withdrawn
    </Button>
  </ListItem>
)

export default DailyLimit
