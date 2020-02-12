// @flow
import React, { memo } from 'react'
import { List, Set } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Img from '~/components/layout/Img'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { type Token } from '~/logic/tokens/store/model/token'
import { styles } from './style'

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

const TokenRow = memo(({ data, index, classes, style }: Props) => {
  const { tokens, activeTokensAddresses, onSwitch } = data
  const token: Token = tokens.get(index)
  const isActive = activeTokensAddresses.has(token.address)

  return (
    <div style={style}>
      <ListItem className={classes.token} classes={{ root: classes.tokenRoot }}>
        <ListItemIcon className={classes.tokenIcon}>
          <Img src={token.logoUri} height={28} alt={token.name} onError={setImageToPlaceholder} />
        </ListItemIcon>
        <ListItemText primary={token.symbol} secondary={token.name} />
        {token.address !== ETH_ADDRESS && (
          <ListItemSecondaryAction>
            <Switch
              onChange={onSwitch(token)}
              checked={isActive}
              inputProps={{ 'data-testid': `${token.symbol}_${TOGGLE_TOKEN_TEST_ID}` }}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  )
})

export default withStyles(styles)(TokenRow)
