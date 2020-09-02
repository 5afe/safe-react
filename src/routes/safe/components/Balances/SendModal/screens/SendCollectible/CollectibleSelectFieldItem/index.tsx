import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { TokenLogo } from 'src/components/TokenLogo'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { NFTAsset, NFTToken } from 'src/logic/collectibles/sources/OpenSea'
import { useToken } from 'src/logic/tokens/hooks/useToken'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/SendCollectible/CollectibleSelectFieldItem/styles'

const useStyles = makeStyles(styles)

type CollectibleSelectFieldItemProps = {
  token: NFTToken
}

export const CollectibleSelectFieldItem = ({ token }: CollectibleSelectFieldItemProps): React.ReactElement => {
  const classes = useStyles()
  const nftToken = useToken(token.assetAddress) as NFTAsset | null

  return (
    <MenuItem key={`${token.assetAddress}-${token.tokenId}`} value={token.tokenId}>
      <ListItemIcon className={classes.tokenImage}>
        <TokenLogo height={28} tokenName={nftToken?.name} tokenLogoUri={nftToken?.image} />
      </ListItemIcon>
      <ListItemText primary={nftToken?.name} secondary={`token ID: ${token.tokenId}`} />
    </MenuItem>
  )
}
