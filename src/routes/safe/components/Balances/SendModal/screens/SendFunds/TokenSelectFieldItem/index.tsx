import React from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'

import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { TokenLogo } from 'src/components/TokenLogo'
import { Token } from 'src/logic/tokens/store/model/token'
import { useToken } from 'src/logic/tokens/hooks/useToken'

type TokenSelectFieldItemProps = {
  token: Token
}

export const TokenSelectFieldItem = ({ token }: TokenSelectFieldItemProps): React.ReactElement => {
  const tokenMetadata = useToken(token.address) as Token | null
  return (
    <MenuItem key={token.address} value={token.address}>
      <ListItemIcon>
        <TokenLogo tokenName={tokenMetadata?.name} tokenLogoUri={tokenMetadata?.logoUri} />
      </ListItemIcon>
      <ListItemText
        primary={token.name}
        secondary={`${formatAmount(token.balance as string)} ${token.symbol}`}
        data-testid={`select-token-${token.name}`}
      />
    </MenuItem>
  )
}
