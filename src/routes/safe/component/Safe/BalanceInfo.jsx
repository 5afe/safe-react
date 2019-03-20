// @flow
import * as React from 'react'
import classNames from 'classnames'
import Link from '~/components/layout/Link'
import AccountBalance from '@material-ui/icons/AccountBalance'
import Settings from '@material-ui/icons/Settings'
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
import Button from '~/components/layout/Button'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import { type WithStyles } from '~/theme/mui'
import { type Token } from '~/routes/tokens/store/model/token'
import { settingsUrlFrom } from '~/routes'

type Props = Open & WithStyles & {
  safeAddress: string,
  tokens: Map<string, Token>,
  onMoveFunds: (token: Token) => void,
}

const styles = {
  nested: {
    paddingLeft: '40px',
  },
}

export const MOVE_FUNDS_BUTTON_TEXT = 'Move'

const BalanceComponent = openHoc(({
  open, toggle, tokens, classes, onMoveFunds, safeAddress,
}: Props) => {
  const hasBalances = tokens.count() > 0
  const settingsUrl = settingsUrlFrom(safeAddress)

  return (
    <React.Fragment>
      <ListItem onClick={hasBalances ? toggle : undefined}>
        <Avatar>
          <AccountBalance />
        </Avatar>
        <ListItemText primary="Balance" secondary="List of different token balances" />
        <ListItemIcon>
          <IconButton to={settingsUrl} disabled={!hasBalances} component={Link} className={classes.button}>
            <Settings />
          </IconButton>
        </ListItemIcon>
        <ListItemIcon>
          {open
            ? <IconButton disableRipple><ExpandLess /></IconButton>
            : <IconButton disabled={!hasBalances} disableRipple><ExpandMore /></IconButton>
          }
        </ListItemIcon>
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          {tokens.valueSeq().map((token: Token) => {
            const symbol = token.get('symbol')
            const name = token.get('name')
            const disabled = Number(token.get('funds')) === 0
            const onMoveFundsClick = () => onMoveFunds(token)

            return (
              <ListItem key={symbol} className={classNames(classes.nested, symbol)}>
                <ListItemIcon>
                  <Img src={token.get('logoUri')} height={30} alt={name} />
                </ListItemIcon>
                <ListItemText primary={name} secondary={`${token.get('funds')} ${symbol}`} />
                <Button variant="contained" color="primary" onClick={onMoveFundsClick} disabled={disabled}>
                  {MOVE_FUNDS_BUTTON_TEXT}
                </Button>
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </React.Fragment>
  )
})

export default withStyles(styles)(BalanceComponent)
