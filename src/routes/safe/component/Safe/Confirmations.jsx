// @flow
import * as React from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import DoneAll from 'material-ui-icons/DoneAll'
import ListItemText from '~/components/List/ListItemText'

type Props = {
  confirmations: number,
}

const Confirmations = ({ confirmations }: Props) => (
  <ListItem>
    <Avatar>
      <DoneAll />
    </Avatar>
    <ListItemText
      primary="Confirmations"
      secondary={`${confirmations} required confirmations per transaction`}
      cut
    />
  </ListItem>
)

export default Confirmations
