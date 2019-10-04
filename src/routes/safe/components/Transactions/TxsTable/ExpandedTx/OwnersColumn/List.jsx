// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Chip from '@material-ui/core/Chip'
import EtherscanLink from '~/components/EtherscanLink'
import Identicon from '~/components/Identicon'
import Hairline from '~/components/layout/Hairline'
import { type Owner } from '~/routes/safe/store/models/owner'
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

const OwnerComponent = withStyles(styles)(({ owner, classes, isExecutor }: OwnerProps) => (
  <ListItem key={owner.address} className={classes.owner}>
    <ListItemIcon>
      <Identicon address={owner.address} diameter={32} className={classes.icon} />
    </ListItemIcon>
    <ListItemText
      primary={owner.name}
      secondary={(
        <EtherscanLink type="tx" value={owner.address} cut={4} />
      )}
    />
    {isExecutor && <Chip label="EXECUTOR" color="secondary" />}
  </ListItem>
))

const OwnersList = ({ owners, classes, executionConfirmation }: ListProps) => (
  <>
    <MuiList className={classes.ownersList}>
      {executionConfirmation && <OwnerComponent owner={executionConfirmation} isExecutor />}
      {owners.map((owner) => (
        <OwnerComponent key={owner.address} owner={owner} />
      ))}
    </MuiList>
    <Hairline color="#d4d53d" />
  </>
)

export default withStyles(styles)(OwnersList)
