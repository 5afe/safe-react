import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import React, { memo } from 'react'

import { styles } from './style'

import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'

import { NFTAsset } from 'src/logic/collectibles/sources/OpenSea'
import Img from 'src/components/layout/Img'

import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
export const TOGGLE_ASSET_TEST_ID = 'toggle-asset-btn'

type Props = {
  data: {
    assets: Record<string, NFTAsset>
    activeAssetsAddresses: Set<string>
    onSwitch: (asset: NFTAsset) => () => void
  }
  style: unknown
  index: number
  isScrolling?: boolean
}

const useStyles = makeStyles(styles)

const AssetRow = memo(
  (props: Props): React.ReactElement => {
    const { data, index, style } = props
    const classes = useStyles()
    const { activeAssetsAddresses, assets, onSwitch } = data
    const asset = assets[index]
    const { address, name, symbol, image } = asset
    const isActive = activeAssetsAddresses.has(asset.address)

    return (
      <div style={style}>
        <ListItem>
          <ListItemIcon className={classes.tokenIcon}>
            <Img alt={name} height={28} onError={setImageToPlaceholder} src={image} />
          </ListItemIcon>
          <ListItemText primary={symbol} secondary={name} />
          {address !== ETH_ADDRESS && (
            <ListItemSecondaryAction>
              <Switch
                checked={isActive}
                inputProps={{ 'data-testid': `${symbol}_${TOGGLE_ASSET_TEST_ID}` } as unknown}
                onChange={onSwitch(asset)}
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </div>
    )
  },
)

AssetRow.displayName = 'AssetRow'

export default AssetRow
