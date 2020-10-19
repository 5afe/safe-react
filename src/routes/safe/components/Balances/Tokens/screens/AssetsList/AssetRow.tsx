import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import React, { memo } from 'react'

import { useStyles } from 'src/routes/safe/components/Balances/Tokens/screens/TokenList/style'
import Img from 'src/components/layout/Img'
import { getNetworkInfo } from 'src/config'
import { setCollectibleImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'

export const TOGGLE_ASSET_TEST_ID = 'toggle-asset-btn'

const { nativeCoin } = getNetworkInfo()

const AssetRow = memo(({ data, index, style }: any) => {
  const classes = useStyles()
  const { activeAssetsAddresses, assets, onSwitch } = data
  const asset = assets[index]
  const { address, image, name, symbol } = asset
  const isActive = activeAssetsAddresses.includes(asset.address)

  return (
    <div style={style}>
      <ListItem classes={{ root: classes.tokenRoot }} className={classes.token}>
        <ListItemIcon className={classes.tokenIcon}>
          <Img alt={name} height={28} onError={setCollectibleImageToPlaceholder} src={image} />
        </ListItemIcon>
        <ListItemText primary={symbol} secondary={name} />
        {address !== nativeCoin.address && (
          <ListItemSecondaryAction>
            <Switch
              checked={isActive}
              inputProps={{ 'data-testid': `${symbol}_${TOGGLE_ASSET_TEST_ID}` } as any}
              onChange={onSwitch(asset)}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  )
})

AssetRow.displayName = 'AssetRow'

export default AssetRow
