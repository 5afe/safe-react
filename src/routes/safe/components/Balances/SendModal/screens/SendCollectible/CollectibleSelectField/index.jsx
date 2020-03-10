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
import type { NFTTokensState } from '~/logic/collectibles/store/reducer/collectibles'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { textShortener } from '~/utils/strings'

type SelectedCollectibleProps = {
  tokens: NFTTokensState,
  tokenId: string | number,
}

const useSelectedCollectibleStyles = makeStyles(selectedTokenStyles)

const SelectedCollectible = ({ tokenId, tokens }: SelectedCollectibleProps) => {
  const classes = useSelectedCollectibleStyles()
  const token = tokenId && tokens ? tokens.find(({ tokenId: id }) => tokenId === id) : null
  const shortener = textShortener({ charsStart: 40, charsEnd: 0 })

  return (
    <MenuItem className={classes.container}>
      {token ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <Img alt={token.description} height={28} onError={setImageToPlaceholder} src={token.image} />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={shortener(token.name)}
            secondary={`token ID: ${shortener(token.tokenId)}`}
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
  initialValue: string,
  tokens: NFTTokensState,
}

const useCollectibleSelectFieldStyles = makeStyles(selectStyles)

const CollectibleSelectField = ({ initialValue, tokens }: SelectFieldProps) => {
  const classes = useCollectibleSelectFieldStyles()

  return (
    <Field
      className={classes.selectMenu}
      component={SelectField}
      displayEmpty
      initialValue={initialValue}
      name="nftTokenId"
      renderValue={nftTokenId => <SelectedCollectible tokenId={nftTokenId} tokens={tokens} />}
      validate={required}
    >
      {tokens &&
        tokens.map(token => (
          <MenuItem key={`${token.assetAddress}-${token.tokenId}`} value={token.tokenId}>
            <ListItemIcon>
              <Img alt={token.name} height={28} onError={setImageToPlaceholder} src={token.image} />
            </ListItemIcon>
            <ListItemText primary={token.name} secondary={`token ID: ${token.tokenId}`} />
          </MenuItem>
        ))}
    </Field>
  )
}

export default CollectibleSelectField
