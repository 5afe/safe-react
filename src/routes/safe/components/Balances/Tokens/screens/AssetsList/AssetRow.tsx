import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'
import React, { memo } from 'react'

import { styles } from './style'

import Img from 'src/components/layout/Img'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'

export const TOGGLE_ASSET_TEST_ID = 'toggle-asset-btn'

// eslint-disable-next-line react/display-name
const AssetRow = memo(({ classes, data, index, style }: any) => {
  const { activeAssetsAddresses, assets, onSwitch } = data
  const asset = assets.get(index)
  const { address, image, name, symbol } = asset
  const isActive = activeAssetsAddresses.has(asset.address)

  return (
    <div style={style}>
      <ListItem classes={{ root: classes.tokenRoot }} className={classes.token}>
        <ListItemIcon className={classes.tokenIcon}>
          <Img alt={name} height={28} onError={setImageToPlaceholder} src={image} />
        </ListItemIcon>
        <ListItemText primary={symbol} secondary={name} />
        {address !== ETH_ADDRESS && (
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

export default withStyles(styles as any)(AssetRow)
