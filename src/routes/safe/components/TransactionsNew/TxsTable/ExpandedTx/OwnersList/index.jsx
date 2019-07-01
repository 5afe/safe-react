// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Tab from '@material-ui/core/Tab'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Span from '~/components/layout/Span'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import { openTxInEtherScan } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
// import { styles } from './style'

type Props = {
  owners: List<string>,
}

const OwnersList = ({ owners }: Props) => (
  <MuiList>
    {owners.map(owner => (
      <ListItem>
        <ListItemText>{owner}</ListItemText>
      </ListItem>
    ))}
  </MuiList>
)

export default OwnersList
