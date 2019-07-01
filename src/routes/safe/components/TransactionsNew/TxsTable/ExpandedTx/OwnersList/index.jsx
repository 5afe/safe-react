// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tab from '@material-ui/core/Tab'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Span from '~/components/layout/Span'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import Identicon from '~/components/Identicon'
import { type Owner } from '~/routes/safe/store/models/owner'
import { openTxInEtherScan } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { styles } from './style'

type Props = {
  owners: List<Owner>,
  classes: Object,
}

const OwnersList = ({ owners, classes }: Props) => (
  <MuiList className={classes.ownersList}>
    {owners.map(owner => (
      <ListItem key={owner.address} className={classes.owner}>
        <ListItemIcon>
          <Identicon address={owner.address} diameter={32} className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary={owner.name} secondary={owner.address} />
      </ListItem>
    ))}
  </MuiList>
)

export default withStyles(styles)(OwnersList)
