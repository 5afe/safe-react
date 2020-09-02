import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import React, { memo } from 'react'

import { styles } from './style'

import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'

import { TokenLogo } from 'src/components/TokenLogo'
import { Token } from 'src/logic/tokens/store/model/token'
import { List } from 'immutable'
import { useToken } from 'src/logic/tokens/hooks/useToken'

export const TOGGLE_TOKEN_TEST_ID = 'toggle-token-btn'

const useStyles = makeStyles(styles)

type Props = {
  data: {
    tokens: List<Token>
    activeTokensAddresses: Set<string>
    onSwitch: (asset: Token) => () => void
  }
  style: unknown
  index: number
  isScrolling?: boolean
}
const TokenRow = memo(({ data, index, style }: Props) => {
  const { activeTokensAddresses, onSwitch, tokens } = data
  const classes = useStyles()
  const token = tokens.get(index)
  const isActive = activeTokensAddresses.has(token.address)
  const tokenMetadata = useToken(token.address) as Token | null

  return (
    <div style={style}>
      <ListItem classes={{ root: classes.tokenRoot }} className={classes.token}>
        <ListItemIcon className={classes.tokenIcon}>
          <TokenLogo height={28} tokenName={tokenMetadata?.name} tokenLogoUri={tokenMetadata?.logoUri} />
        </ListItemIcon>
        <ListItemText primary={token.symbol} secondary={token.name} />
        {token.address !== ETH_ADDRESS && (
          <ListItemSecondaryAction>
            <Switch
              checked={isActive}
              inputProps={{ 'data-testid': `${token.symbol}_${TOGGLE_TOKEN_TEST_ID}` } as any}
              onChange={onSwitch(token)}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  )
})

TokenRow.displayName = 'TokenRow'

export default TokenRow
