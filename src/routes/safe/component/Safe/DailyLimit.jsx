// @flow
import * as React from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import NotificationsPaused from 'material-ui-icons/NotificationsPaused'
import ListItemText from '~/components/List/ListItemText'

type Props = {
  limit: number,
}

const DailyLimit = ({ limit }: Props) => (
  <ListItem>
    <Avatar>
      <NotificationsPaused />
    </Avatar>
    <ListItemText primary="Daily Limit" secondary={`${limit} ETH`} />
  </ListItem>
)

export default DailyLimit
