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
import { type OwnerProps } from '~/routes/safe/store/model/owner'
import { type WithStyles } from '~/theme/mui'

const styles = {
  nested: {
    paddingLeft: '40px',
  },
}

type Props = Open & WithStyles & {
  owners: List<OwnerProps>,
}

const Owners = openHoc(({
  open, toggle, owners, classes,
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
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {owners.map(owner => (
          <ListItem key={owner.address} button className={classes.nested}>
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
