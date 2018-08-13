// @flow
import * as React from 'react'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import { withStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '~/components/List/ListItemText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Avatar from '@material-ui/core/Avatar'
import Group from '@material-ui/icons/Group'
import Person from '@material-ui/icons/Person'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
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

const GnoConfirmation = ({ owner, type, hash }: ConfirmationProps) => {
  const address = owner.get('address')
  const confirmed = type === 'confirmed'
  const text = confirmed ? 'Confirmed' : 'Not confirmed'
  const hashText = confirmed ? `Confirmation hash: ${hash}` : undefined

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
        {open
          ? <IconButton disableRipple><ExpandLess /></IconButton>
          : <IconButton disableRipple><ExpandMore /></IconButton>
        }
      </ListItemIcon>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding style={{ width: '100%' }}>
        {confirmations.map(confirmation => (
          <GnoConfirmation
            key={confirmation.get('owner').get('address')}
            owner={confirmation.get('owner')}
            type={confirmation.get('type')}
            hash={confirmation.get('hash')}
          />
        ))}
      </List>
    </Collapse>
  </React.Fragment>
))

export default withStyles(styles)(Confirmaitons)
