// @flow
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'
import { List, Set } from 'immutable'
import React, { memo } from 'react'

import { styles } from './style'

import Img from '~/components/layout/Img'
import { type Token } from '~/logic/tokens/store/model/token'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'

export const TOGGLE_TOKEN_TEST_ID = 'toggle-token-btn'

type Props = {
  data: {
    activeTokensAddresses: Set<string>,
    tokens: List<Token>,
    onSwitch: Function,
  },
  style: Object,
  index: number,
  classes: Object,
}

// eslint-disable-next-line react/display-name
const TokenRow = memo(({ classes, data, index, style }: Props) => {
  const { activeTokensAddresses, onSwitch, tokens } = data
  const token: Token = tokens.get(index)
  const isActive = activeTokensAddresses.has(token.address)

  return (
    <div style={style}>
      <ListItem classes={{ root: classes.tokenRoot }} className={classes.token}>
        <ListItemIcon className={classes.tokenIcon}>
          <Img alt={token.name} height={28} onError={setImageToPlaceholder} src={token.logoUri} />
        </ListItemIcon>
        <ListItemText primary={token.symbol} secondary={token.name} />
        {token.address !== ETH_ADDRESS && (
          <ListItemSecondaryAction>
            <Switch
              checked={isActive}
              inputProps={{ 'data-testid': `${token.symbol}_${TOGGLE_TOKEN_TEST_ID}` }}
              onChange={onSwitch(token)}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  )
})

export default withStyles(styles)(TokenRow)
