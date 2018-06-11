// @flow
import * as React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import AccountBalance from '@material-ui/icons/AccountBalance'

type Props = {
  balance: string,
}

const Balance = ({ balance }: Props) => (
  <ListItem>
    <Avatar>
      <AccountBalance />
    </Avatar>
    <ListItemText primary="Balance" secondary={`${balance} ETH`} />
  </ListItem>
)

export default Balance
