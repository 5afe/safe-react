// @flow
import * as React from 'react'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import { withStyles } from 'material-ui/styles'
import Collapse from 'material-ui/transitions/Collapse'
import ListItemText from '~/components/List/ListItemText'
import List, { ListItem, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from '~/components/layout/Button'
import Group from 'material-ui-icons/Group'
import Person from 'material-ui-icons/Person'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import { type OwnerProps } from '~/routes/safe/store/model/owner'
import { type WithStyles } from '~/theme/mui'

const styles = {
  nested: {
    paddingLeft: '40px',
  },
}

type Props = Open & WithStyles & {
  owners: List<OwnerProps>,
  onAddOwner: () => void,
}

export const ADD_OWNER_BUTTON_TEXT = 'Add'

const Owners = openHoc(({
  open, toggle, owners, classes, onAddOwner,
}: Props) => (
  <React.Fragment>
    <ListItem onClick={toggle}>
      <Avatar>
        <Group />
      </Avatar>
      <ListItemText primary="Owners" secondary={`${owners.size} owners`} />
      <ListItemIcon>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemIcon>
      <Button
        variant="raised"
        color="primary"
        onClick={onAddOwner}
      >
        {ADD_OWNER_BUTTON_TEXT}
      </Button>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {owners.map(owner => (
          <ListItem key={owner.address} className={classes.nested}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText
              cut
              primary={owner.name}
              secondary={owner.address}
            />
          </ListItem>
        ))}
      </List>
    </Collapse>
  </React.Fragment>
))

export default withStyles(styles)(Owners)
