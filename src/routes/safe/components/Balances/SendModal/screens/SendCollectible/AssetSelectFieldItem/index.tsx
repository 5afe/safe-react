import React from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'

import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { TokenLogo } from 'src/components/TokenLogo'
import { useToken } from 'src/logic/tokens/hooks/useToken'
import { NFTAsset } from 'src/logic/collectibles/sources/OpenSea'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'

type TokenSelectFieldItemProps = {
  asset: NFTAsset
}

const useStyles = makeStyles(styles)

export const AssetSelectFieldItem = ({ asset }: TokenSelectFieldItemProps): React.ReactElement => {
  const token = useToken(asset.address) as NFTAsset | null

  const classes = useStyles()
  return (
    <MenuItem key={asset.slug} value={asset.address}>
      <ListItemIcon className={classes.tokenImage}>
        <TokenLogo tokenName={token?.name} tokenLogoUri={token?.image} />
      </ListItemIcon>
      <ListItemText
        primary={asset.name}
        secondary={`Count: ${formatAmount(asset.numberOfTokens.toString())} ${asset.symbol}`}
      />
    </MenuItem>
  )
}
