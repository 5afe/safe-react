// @flow
import * as React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import AccountBalance from 'material-ui-icons/AccountBalance'

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
