// @flow
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { selectStyles, selectedTokenStyles } from './style'

import Field from '~/components/forms/Field'
import SelectField from '~/components/forms/SelectField'
import { required } from '~/components/forms/validator'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import type { CollectibleData } from '~/routes/safe/components/Balances/Collectibles/types'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'

type SelectedCollectibleProps = {
  asset?: CollectibleData,
  tokenId?: string | number,
}

const useSelectedCollectibleStyles = makeStyles(selectedTokenStyles)

const SelectedCollectible = ({ asset, tokenId }: SelectedCollectibleProps) => {
  const classes = useSelectedCollectibleStyles()
  const token = tokenId ? asset && asset.data.find(({ tokenId: id }) => tokenId === id) : null

  return (
    <MenuItem className={classes.container}>
      {token ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <Img alt={token.description} height={28} onError={setImageToPlaceholder} src={token.image} />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={token.title}
            secondary={`${token.tokenId} ${token.asset.symbol}`}
          />
        </>
      ) : (
        <Paragraph color="disabled" size="md" style={{ opacity: 0.5 }} weight="light">
          Select an asset*
        </Paragraph>
      )}
    </MenuItem>
  )
}

type SelectFieldProps = {
  asset?: CollectibleData,
  initialValue: string,
}

const useCollectibleSelectFieldStyles = makeStyles(selectStyles)

const CollectibleSelectField = ({ asset, initialValue }: SelectFieldProps) => {
  const classes = useCollectibleSelectFieldStyles()

  return (
    <Field
      className={classes.selectMenu}
      component={SelectField}
      displayEmpty
      initialValue={initialValue}
      name="collectible"
      renderValue={tokenId => <SelectedCollectible asset={asset} tokenId={tokenId} />}
      validate={required}
    >
      {asset &&
        asset.data.map(token => (
          <MenuItem key={`${token.assetAddress}-${token.tokenId}`} value={token.tokenId}>
            <ListItemIcon>
              <Img alt={token.title} height={28} onError={setImageToPlaceholder} src={token.image} />
            </ListItemIcon>
            <ListItemText primary={token.title} secondary={`${token.tokenId} ${token.asset.symbol}`} />
          </MenuItem>
        ))}
    </Field>
  )
}

export default CollectibleSelectField
