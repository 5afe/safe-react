// @flow
import * as React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Mail from 'material-ui-icons/Mail'

type Props = {
  address: string,
}

const Address = ({ address }: Props) => (
  <ListItem>
    <Avatar>
      <Mail />
    </Avatar>
    <ListItemText primary="Safe Address" secondary={address} />
  </ListItem>
)

export default Address
