import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import React, { CSSProperties, memo, ReactElement } from 'react'

import { useStyles } from './style'
import Img from 'src/components/layout/Img'
import { getNetworkInfo } from 'src/config'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { ItemData } from 'src/routes/safe/components/Balances/Tokens/screens/TokenList/index'

export const TOGGLE_TOKEN_TEST_ID = 'toggle-token-btn'

interface TokenRowProps {
  data: ItemData
  index: number
  style: CSSProperties
}

const { nativeCoin } = getNetworkInfo()

const TokenRow = memo(({ data, index, style }: TokenRowProps): ReactElement | null => {
  const classes = useStyles()
  const { activeTokensAddresses, onSwitch, tokens } = data
  const token = tokens.get(index)

  if (!token) {
    return null
  }

  const isActive = activeTokensAddresses.has(token.address)

  return (
    <div style={style}>
      <ListItem classes={{ root: classes.tokenRoot }} className={classes.token}>
        <ListItemIcon className={classes.tokenIcon}>
          <Img alt={token.name} height={28} onError={setImageToPlaceholder} src={token.logoUri} />
        </ListItemIcon>
        <ListItemText primary={token.symbol} secondary={token.name} />
        {token.address !== nativeCoin.address && (
          <ListItemSecondaryAction data-testid={`${token.symbol}_${TOGGLE_TOKEN_TEST_ID}`}>
            <Switch checked={isActive} onChange={onSwitch(token)} />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  )
})

TokenRow.displayName = 'TokenRow'

export default TokenRow
