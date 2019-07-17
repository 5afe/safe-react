// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Chip from '@material-ui/core/Chip'
import Identicon from '~/components/Identicon'
import Hairline from '~/components/layout/Hairline'
import { type Owner } from '~/routes/safe/store/models/owner'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { secondary } from '~/theme/variables'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { styles } from './style'

type ListProps = {
  owners: List<Owner>,
  classes: Object,
  executionConfirmation?: Owner,
}

type OwnerProps = {
  owner: Owner,
  classes: Object,
  isExecutor?: boolean,
}

const openIconStyle = {
  height: '13px',
  color: secondary,
}

const OwnerComponent = withStyles(styles)(({ owner, classes, isExecutor }: OwnerProps) => (
  <ListItem key={owner.address} className={classes.owner}>
    <ListItemIcon>
      <Identicon address={owner.address} diameter={32} className={classes.icon} />
    </ListItemIcon>
    <ListItemText
      primary={owner.name}
      secondary={(
        <a href={getEtherScanLink('address', owner.address, 'rinkeby')} target="_blank" rel="noopener noreferrer">
          {shortVersionOf(owner.address, 4)}
          {' '}
          <OpenInNew style={openIconStyle} />
        </a>
      )}
    />
    {isExecutor && <Chip label="EXECUTOR" color="secondary" />}
  </ListItem>
))

const OwnersList = ({ owners, classes, executionConfirmation }: ListProps) => (
  <>
    <MuiList className={classes.ownersList}>
      {executionConfirmation && <OwnerComponent owner={executionConfirmation} isExecutor />}
      {owners.map(owner => (
        <OwnerComponent key={owner.address} owner={owner} />
      ))}
    </MuiList>
    <Hairline color="#c8ced4" />
  </>
)

export default withStyles(styles)(OwnersList)
