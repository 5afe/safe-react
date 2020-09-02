import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { selectStyles, selectedTokenStyles } from './style'

import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import { required } from 'src/components/forms/validator'
import Paragraph from 'src/components/layout/Paragraph'
import { textShortener } from 'src/utils/strings'
import { TokenLogo } from 'src/components/TokenLogo'
import { useToken } from 'src/logic/tokens/hooks/useToken'
import { NFTAsset, NFTToken } from 'src/logic/collectibles/sources/OpenSea'
import { CollectibleSelectFieldItem } from 'src/routes/safe/components/Balances/SendModal/screens/SendCollectible/CollectibleSelectFieldItem'

const useSelectedCollectibleStyles = makeStyles(selectedTokenStyles)

type SelectedCollectibleProps = {
  tokenId: string
  tokens: NFTToken[]
}

const SelectedCollectible = ({ tokenId, tokens }: SelectedCollectibleProps): React.ReactElement => {
  const classes = useSelectedCollectibleStyles()
  const token = tokenId && tokens ? tokens.find(({ tokenId: id }) => tokenId === id) : null
  const shortener = textShortener({ charsStart: 40, charsEnd: 0 })
  const tokenLogoMetadata = useToken(token?.assetAddress) as NFTAsset | null

  return (
    <MenuItem className={classes.container}>
      {token ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <TokenLogo height={28} tokenName={tokenLogoMetadata?.name} tokenLogoUri={tokenLogoMetadata?.image} />
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

type CollectibleSelectFieldType = {
  initialValue: string
  tokens: NFTToken[]
}

const CollectibleSelectField = ({ initialValue, tokens }: CollectibleSelectFieldType): React.ReactElement => {
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
        <CollectibleSelectFieldItem token={token} key={token.assetAddress} />
      ))}
    </Field>
  )
}

export default CollectibleSelectField
