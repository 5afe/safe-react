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
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import type { NFTAsset } from '~/routes/safe/components/Balances/Collectibles/types'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'

export const TOGGLE_ASSET_TEST_ID = 'toggle-asset-btn'

type Props = {
  data: {
    activeAssetsAddresses: Set<string>,
    assets: List<NFTAsset>,
    onSwitch: Function,
  },
  style: Object,
  index: number,
  classes: Object,
}

// eslint-disable-next-line react/display-name
const AssetRow = memo(({ classes, data, index, style }: Props) => {
  const { activeAssetsAddresses, assets, onSwitch } = data
  const asset: NFTAsset = assets.get(index)
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
              inputProps={{ 'data-testid': `${symbol}_${TOGGLE_ASSET_TEST_ID}` }}
              onChange={onSwitch(asset)}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  )
})

export default withStyles(styles)(AssetRow)
