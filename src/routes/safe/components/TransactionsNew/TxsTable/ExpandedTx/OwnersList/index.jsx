// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Identicon from '~/components/Identicon'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { secondary } from '~/theme/variables'
import { styles } from './style'

type Props = {
  owners: List<Owner>,
  classes: Object,
}

const openIconStyle = {
  height: '13px',
  color: secondary,
}

const OwnersList = ({ owners, classes }: Props) => (
  <MuiList className={classes.ownersList}>
    {owners.map(owner => (
      <ListItem key={owner.address} className={classes.owner}>
        <ListItemIcon>
          <Identicon address={owner.address} diameter={32} className={classes.icon} />
        </ListItemIcon>
        <ListItemText
          primary={owner.name}
          secondary={(
            <a href={getEtherScanLink(owner.address, 'rinkeby')} target="_blank" rel="noopener noreferrer">
              {owner.address}
              {' '}
              <OpenInNew style={openIconStyle} />
            </a>
          )}
        />
      </ListItem>
    ))}
  </MuiList>
)

export default withStyles(styles)(OwnersList)
