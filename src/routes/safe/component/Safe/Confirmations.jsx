// @flow
import * as React from 'react'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import DoneAll from '@material-ui/icons/DoneAll'
import ListItemText from '~/components/List/ListItemText'
import Button from '~/components/layout/Button'

type Props = {
  confirmations: number,
  onEditThreshold: () => void,
}

const EDIT_THRESHOLD_BUTTON_TEXT = 'EDIT'

const Confirmations = ({ confirmations, onEditThreshold }: Props) => (
  <ListItem>
    <Avatar>
      <DoneAll />
    </Avatar>
    <ListItemText
      primary="Confirmations"
      secondary={`${confirmations} required confirmations per transaction`}
      cut
    />
    <Button
      variant="raised"
      color="primary"
      onClick={onEditThreshold}
    >
      {EDIT_THRESHOLD_BUTTON_TEXT}
    </Button>
  </ListItem>
)

export default Confirmations
