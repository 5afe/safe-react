// @flow
import * as React from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import NotificationsPaused from 'material-ui-icons/NotificationsPaused'
import Button from '~/components/layout/Button'
import ListItemText from '~/components/List/ListItemText'
import { type DailyLimit } from '~/routes/safe/store/model/dailyLimit'

type Props = {
  dailyLimit: DailyLimit,
  onWithdrawn: () => void,
}

export const WITHDRAWN_BUTTON_TEXT = 'Withdrawn'

const DailyLimitComponent = ({ dailyLimit, onWithdrawn }: Props) => {
  const limit = dailyLimit.get('value')
  const spentToday = dailyLimit.get('spentToday')
  const disabled = spentToday >= limit
  const text = `${limit} ETH (spent today: ${spentToday} ETH)`

  return (
    <ListItem>
      <Avatar>
        <NotificationsPaused />
      </Avatar>
      <ListItemText primary="Daily Limit" secondary={text} />
      <Button
        variant="raised"
        color="primary"
        onClick={onWithdrawn}
        disabled={disabled}
      >
        {WITHDRAWN_BUTTON_TEXT}
      </Button>
    </ListItem>
  )
}

export default DailyLimitComponent
