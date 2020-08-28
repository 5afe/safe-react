import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { selectStyles, selectedTokenStyles } from './style'

import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import { required } from 'src/components/forms/validator'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { textShortener } from 'src/utils/strings'

const useSelectedCollectibleStyles = makeStyles(selectedTokenStyles)

const SelectedCollectible = ({ tokenId, tokens }) => {
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
          Select a token*
        </Paragraph>
      )}
    </MenuItem>
  )
}

const useCollectibleSelectFieldStyles = makeStyles(selectStyles)

const CollectibleSelectField = ({ initialValue, tokens }) => {
  const classes = useCollectibleSelectFieldStyles()

  return (
    <Field
      className={classes.selectMenu}
      component={SelectField}
      disabled={!tokens.length}
      initialValue={initialValue}
      name="nftTokenId"
      renderValue={(nftTokenId) => <SelectedCollectible tokenId={nftTokenId} tokens={tokens} />}
      validate={required}
    >
      {tokens.map((token) => (
        <MenuItem key={`${token.assetAddress}-${token.tokenId}`} value={token.tokenId}>
          <ListItemIcon className={classes.tokenImage}>
            <Img alt={token.name} height={28} onError={setImageToPlaceholder} src={token.image} />
          </ListItemIcon>
          <ListItemText primary={token.name} secondary={`token ID: ${token.tokenId}`} />
        </MenuItem>
      ))}
    </Field>
  )
}

export default CollectibleSelectField
