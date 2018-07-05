// @flow
import * as React from 'react'
import AccountBalance from '@material-ui/icons/AccountBalance'
import Avatar from '@material-ui/core/Avatar'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Img from '~/components/layout/Img'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Map } from 'immutable'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import { type WithStyles } from '~/theme/mui'
import { type Balance } from '~/routes/safe/store/model/balance'

type Props = Open & WithStyles & {
  balances: Map<string, Balance>,
}

const styles = {
  nested: {
    paddingLeft: '40px',
  },
}

const BalanceComponent = openHoc(({
  open, toggle, balances, classes,
}: Props) => (
  <React.Fragment>
    <ListItem onClick={toggle}>
      <Avatar>
        <AccountBalance />
      </Avatar>
      <ListItemText primary="Balance" secondary="List of different token balances" />
      <ListItemIcon>
        {open
          ? <IconButton disableRipple><ExpandLess /></IconButton>
          : <IconButton disableRipple><ExpandMore /></IconButton>
        }
      </ListItemIcon>
    </ListItem>
    <Collapse in={open} timeout="auto">
      <List component="div" disablePadding>
        {balances.valueSeq().map((balance: Balance) => {
          const symbol = balance.get('symbol')
          const name = balance.get('name')

          return (
            <ListItem key={symbol} className={classes.nested}>
              <ListItemIcon>
                <Img src={balance.get('logoUrl')} height={30} alt={name} />
              </ListItemIcon>
              <ListItemText primary={name} secondary={`${balance.get('funds')} ${symbol}`} />
            </ListItem>
          )
        })}
      </List>
    </Collapse>
  </React.Fragment>
))

export default withStyles(styles)(BalanceComponent)
