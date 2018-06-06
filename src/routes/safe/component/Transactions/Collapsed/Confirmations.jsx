// @flow
import * as React from 'react'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import { withStyles } from 'material-ui/styles'
import Collapse from 'material-ui/transitions/Collapse'
import ListItemText from '~/components/List/ListItemText'
import List, { ListItem, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Group from 'material-ui-icons/Group'
import Person from 'material-ui-icons/Person'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import { type WithStyles } from '~/theme/mui'
import { type Confirmation, type ConfirmationProps } from '~/routes/safe/store/model/confirmation'

const styles = {
  nested: {
    paddingLeft: '40px',
  },
}

type Props = Open & WithStyles & {
  confirmations: List<Confirmation>,
  threshold: number,
}

const GnoConfirmation = ({ owner, status, hash }: ConfirmationProps) => {
  const address = owner.get('address')
  const text = status ? 'Confirmed' : 'Not confirmed'
  const hashText = status ? `Confirmation hash: ${hash}` : undefined

  return (
    <React.Fragment>
      <ListItem key={address}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText
          cut
          primary={`${owner.get('name')} [${text}]`}
          secondary={hashText}
        />
      </ListItem>
    </React.Fragment>
  )
}

const Confirmaitons = openHoc(({
  open, toggle, confirmations, threshold,
}: Props) => (
  <React.Fragment>
    <ListItem onClick={toggle}>
      <Avatar>
        <Group />
      </Avatar>
      <ListItemText primary="Threshold" secondary={`${threshold} confirmation${threshold === 1 ? '' : 's'} needed`} />
      <ListItemIcon>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemIcon>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding style={{ width: '100%' }}>
        {confirmations.map(confirmation => (
          <GnoConfirmation
            key={confirmation.get('owner').get('address')}
            owner={confirmation.get('owner')}
            status={confirmation.get('status')}
            hash={confirmation.get('hash')}
          />
        ))}
      </List>
    </Collapse>
  </React.Fragment>
))

export default withStyles(styles)(Confirmaitons)
