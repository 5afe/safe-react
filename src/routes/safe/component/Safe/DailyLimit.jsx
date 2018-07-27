// @flow
import * as React from 'react'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import NotificationsPaused from '@material-ui/icons/NotificationsPaused'
import Button from '~/components/layout/Button'
import ListItemText from '~/components/List/ListItemText'
import { type DailyLimit } from '~/routes/safe/store/model/dailyLimit'

type Props = {
  dailyLimit: DailyLimit,
  onWithdraw: () => void,
  onEditDailyLimit: () => void,
  balance: number,
}
export const EDIT_WITHDRAW = 'Edit'
export const WITHDRAW_BUTTON_TEXT = 'Withdraw'

const editStyle = {
  marginRight: '10px',
}

const DailyLimitComponent = ({
  dailyLimit, balance, onWithdraw, onEditDailyLimit,
}: Props) => {
  const limit = dailyLimit.get('value')
  const spentToday = dailyLimit.get('spentToday')

  const disabled = spentToday >= limit || balance === 0
  const text = `${limit} ETH (spent today: ${spentToday} ETH)`

  return (
    <ListItem>
      <Avatar>
        <NotificationsPaused />
      </Avatar>
      <ListItemText primary="Daily Limit" secondary={text} />
      <Button
        style={editStyle}
        variant="raised"
        color="primary"
        onClick={onEditDailyLimit}
      >
        {EDIT_WITHDRAW}
      </Button>
      <Button
        variant="raised"
        color="primary"
        onClick={onWithdraw}
        disabled={disabled}
      >
        {WITHDRAW_BUTTON_TEXT}
      </Button>
    </ListItem>
  )
}

export default DailyLimitComponent
